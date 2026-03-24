import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Star, ThumbsUp, ThumbsDown, AlertTriangle, CheckCircle, Loader2, Camera, X } from 'lucide-react';
import { submitFeedback, uploadFeedbackPhoto } from '../lib/api';

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placeName: string;
  placeLocation: string;
  accessToken?: string;
  onFeedbackSubmitted?: () => void;
}

export function FeedbackDialog({ 
  open, 
  onOpenChange, 
  placeName, 
  placeLocation,
  accessToken,
  onFeedbackSubmitted 
}: FeedbackDialogProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [conditionsAccurate, setConditionsAccurate] = useState<'yes' | 'no' | null>(null);
  const [actualSafety, setActualSafety] = useState<'safe' | 'caution' | 'unsafe' | null>(null);
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5242880) {
        setError('Photo must be less than 5MB');
        return;
      }

      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setError('Only JPEG, PNG, and WebP images are allowed');
        return;
      }

      setSelectedPhoto(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleRemovePhoto = () => {
    setSelectedPhoto(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!accessToken) {
      setError('Please login to submit feedback');
      return;
    }

    if (rating === 0) {
      setError('Please provide a rating');
      return;
    }

    if (!actualSafety) {
      setError('Please select the safety level you experienced');
      return;
    }

    try {
      setLoading(true);
      setError('');

      let photoUrl = null;
      let photoPath = null;

      // Upload photo if selected
      if (selectedPhoto) {
        setUploadingPhoto(true);
        try {
          const photoData = await uploadFeedbackPhoto(accessToken, selectedPhoto);
          photoUrl = photoData.photoUrl;
          photoPath = photoData.photoPath;
        } catch (err: any) {
          console.error('Photo upload error:', err);
          setError('Failed to upload photo. Submitting feedback without photo...');
          // Continue without photo
        } finally {
          setUploadingPhoto(false);
        }
      }

      await submitFeedback(accessToken, {
        placeName,
        placeLocation,
        rating,
        conditionsAccurate: conditionsAccurate === 'yes',
        actualSafety,
        comments: comments.trim(),
        timestamp: new Date().toISOString(),
        photoUrl,
        photoPath
      });

      setSubmitted(true);
      
      // Call the callback after successful submission
      if (onFeedbackSubmitted) {
        onFeedbackSubmitted();
      }

      // Close dialog after a short delay
      setTimeout(() => {
        onOpenChange(false);
        resetForm();
      }, 1500);
    } catch (err: any) {
      console.error('Feedback submission error:', err);
      setError(err.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setRating(0);
    setHoveredRating(0);
    setConditionsAccurate(null);
    setActualSafety(null);
    setComments('');
    setError('');
    setSubmitted(false);
    setSelectedPhoto(null);
    setPhotoPreview(null);
    setUploadingPhoto(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    resetForm();
  };

  if (submitted) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="mb-4 p-3 bg-green-100 rounded-full">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h3 className="mb-2">Thank You!</h3>
            <p className="text-sm text-muted-foreground">
              Your feedback helps others make better decisions
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Share Your Experience</DialogTitle>
          <DialogDescription>
            Help others by sharing feedback about your visit to {placeName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Overall Rating */}
          <div className="space-y-2">
            <Label>Overall Rating</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-muted-foreground">
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent'}
              </p>
            )}
          </div>

          {/* Conditions Accuracy */}
          <div className="space-y-2">
            <Label>Were the predicted conditions accurate?</Label>
            <div className="flex gap-3">
              <Button
                type="button"
                variant={conditionsAccurate === 'yes' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setConditionsAccurate('yes')}
              >
                <ThumbsUp className="mr-2 h-4 w-4" />
                Yes
              </Button>
              <Button
                type="button"
                variant={conditionsAccurate === 'no' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setConditionsAccurate('no')}
              >
                <ThumbsDown className="mr-2 h-4 w-4" />
                No
              </Button>
            </div>
          </div>

          {/* Actual Safety Level */}
          <div className="space-y-2">
            <Label>How safe was it?</Label>
            <div className="grid grid-cols-1 gap-2">
              <Button
                type="button"
                variant={actualSafety === 'safe' ? 'default' : 'outline'}
                className="justify-start"
                onClick={() => setActualSafety('safe')}
              >
                <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                <span className="flex-1 text-left">Safe - No issues</span>
              </Button>
              <Button
                type="button"
                variant={actualSafety === 'caution' ? 'default' : 'outline'}
                className="justify-start"
                onClick={() => setActualSafety('caution')}
              >
                <AlertTriangle className="mr-2 h-4 w-4 text-yellow-600" />
                <span className="flex-1 text-left">Caution Needed - Some concerns</span>
              </Button>
              <Button
                type="button"
                variant={actualSafety === 'unsafe' ? 'default' : 'outline'}
                className="justify-start"
                onClick={() => setActualSafety('unsafe')}
              >
                <AlertTriangle className="mr-2 h-4 w-4 text-red-600" />
                <span className="flex-1 text-left">Unsafe - Should avoid</span>
              </Button>
            </div>
          </div>

          {/* Photo Upload */}
          <div className="space-y-2">
            <Label>Add Photo (Optional)</Label>
            {photoPreview ? (
              <div className="relative">
                <img 
                  src={photoPreview} 
                  alt="Preview" 
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={handleRemovePhoto}
                  disabled={loading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoSelect}
                  className="hidden"
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Add Photo of Current Conditions
                </Button>
                <p className="text-xs text-muted-foreground mt-1">
                  Max 5MB • JPEG, PNG, or WebP
                </p>
              </div>
            )}
          </div>

          {/* Comments */}
          <div className="space-y-2">
            <Label htmlFor="comments">Additional Comments (Optional)</Label>
            <Textarea
              id="comments"
              placeholder="Share more details about your experience..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {comments.length}/500
            </p>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading || uploadingPhoto}>
            {uploadingPhoto ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading Photo...
              </>
            ) : loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Feedback'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}