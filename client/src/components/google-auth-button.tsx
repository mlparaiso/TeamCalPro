import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LogIn, LogOut, User, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { googleAuthService, GOOGLE_CONFIG } from "@/lib/google-auth";

interface GoogleAuthButtonProps {
  onSignInSuccess?: () => void;
  onSignOut?: () => void;
}

export function GoogleAuthButton({ onSignInSuccess, onSignOut }: GoogleAuthButtonProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    initializeGoogleAuth();
  }, []);

  const initializeGoogleAuth = async () => {
    try {
      setIsLoading(true);
      setError("");

      if (!GOOGLE_CONFIG.clientId || !GOOGLE_CONFIG.apiKey) {
        setError("Google OAuth credentials not configured. Please set VITE_GOOGLE_CLIENT_ID and VITE_GOOGLE_API_KEY environment variables.");
        return;
      }

      await googleAuthService.init(GOOGLE_CONFIG);
      setIsInitialized(true);
      
      const signedIn = googleAuthService.isUserSignedIn();
      setIsSignedIn(signedIn);
      
      if (signedIn) {
        setUserProfile(googleAuthService.getUserProfile());
      }
    } catch (error) {
      console.error('Failed to initialize Google Auth:', error);
      setError("Failed to initialize Google authentication. Please check your internet connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      await googleAuthService.signIn();
      setIsSignedIn(true);
      setUserProfile(googleAuthService.getUserProfile());
      
      toast({
        title: "Success",
        description: "Successfully signed in to Google",
      });
      
      onSignInSuccess?.();
    } catch (error) {
      console.error('Sign in failed:', error);
      setError("Failed to sign in. Please try again.");
      toast({
        title: "Sign In Failed",
        description: "Could not sign in to Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await googleAuthService.signOut();
      setIsSignedIn(false);
      setUserProfile(null);
      
      toast({
        title: "Signed Out",
        description: "Successfully signed out of Google",
      });
      
      onSignOut?.();
    } catch (error) {
      console.error('Sign out failed:', error);
      toast({
        title: "Sign Out Failed",
        description: "Could not sign out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <Card className="bg-destructive/10 border-destructive/20">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-destructive">Authentication Error</h4>
              <p className="text-sm text-destructive/80 mt-1">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={initializeGoogleAuth}
                className="mt-2"
              >
                Retry
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isInitialized) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            <span className="text-sm text-muted-foreground">Initializing Google authentication...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isSignedIn && userProfile) {
    return (
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={userProfile.imageUrl} alt={userProfile.name} />
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-sm">{userProfile.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Connected
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">{userProfile.email}</span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              disabled={isLoading}
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-center space-y-3">
          <div>
            <h4 className="font-medium text-sm">Google Sheets Access</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Sign in with Google to access your spreadsheets
            </p>
          </div>
          <Button
            onClick={handleSignIn}
            disabled={isLoading}
            className="w-full flex items-center space-x-2"
          >
            <LogIn className="h-4 w-4" />
            <span>{isLoading ? "Signing in..." : "Sign in with Google"}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}