import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Camera, Upload, Loader2, Check } from 'lucide-react';
import { uploadProfilePicture, updateAvatar } from '../lib/api';
import { toast } from 'sonner@2.0.3';

interface AvatarSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentAvatarUrl?: string;
  accessToken: string;
  onAvatarUpdated: (newAvatarUrl: string) => void;
}

// Preset avatar collection - cute animals and nature
const PRESET_AVATARS = [
  {
    url: 'https://images.unsplash.com/photo-1710997740246-75b30937dd6d?w=200&h=200&fit=crop',
    name: '🐱 Cat'
  },
  {
    url: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=200&h=200&fit=crop',
    name: '🐕 Dog'
  },
  {
    url: 'https://images.unsplash.com/photo-1627000541127-260ecb511119?w=200&h=200&fit=crop',
    name: '🦉 Owl'
  },
  {
    url: 'https://images.unsplash.com/photo-1715430306822-6961509374e6?w=200&h=200&fit=crop',
    name: '🦊 Fox'
  },
  {
    url: 'https://images.unsplash.com/photo-1703248187251-c897f32fe4ec?w=200&h=200&fit=crop',
    name: '🐼 Panda'
  },
  {
    url: 'https://images.unsplash.com/photo-1695826809809-facc4eb4e85d?w=200&h=200&fit=crop',
    name: '🐰 Rabbit'
  },
  {
    url: 'https://images.unsplash.com/photo-1462888210965-cdf193fb74de?w=200&h=200&fit=crop',
    name: '🐧 Penguin'
  },
  {
    url: 'https://images.unsplash.com/photo-1579972383667-4894c883d674?w=200&h=200&fit=crop',
    name: '🐨 Koala'
  },
  {
    url: 'https://images.unsplash.com/photo-1533651180995-3b8dcd33e834?w=200&h=200&fit=crop',
    name: '🐿️ Squirrel'
  },
  {
    url: 'https://images.unsplash.com/photo-1470854989922-5be2f7456d78?w=200&h=200&fit=crop',
    name: '🦔 Hedgehog'
  },
  {
    url: 'https://images.unsplash.com/photo-1668137474958-3c2b3664bc55?w=200&h=200&fit=crop',
    name: '🦜 Parrot'
  },
  {
    url: 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=200&h=200&fit=crop',
    name: '🦁 Lion'
  },
];

export function AvatarSelector({ open, onOpenChange, currentAvatarUrl, accessToken, onAvatarUpdated }: AvatarSelectorProps) {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatarUrl || '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (2MB)
    if (file.size > 2097152) {
      toast.error('File too large. Maximum size is 2MB');
      return;
    }

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Invalid file type. Only JPEG, PNG, and WebP are allowed');
      return;
    }

    try {
      setUploading(true);
      const data = await uploadProfilePicture(accessToken, file);
      setSelectedAvatar(data.avatarUrl);
      onAvatarUpdated(data.avatarUrl);
      toast.success('Profile picture uploaded successfully!');
      onOpenChange(false);
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };

  const handlePresetSelect = async (avatarUrl: string, avatarName: string) => {
    try {
      setSaving(true);
      await updateAvatar(accessToken, avatarUrl, 'preset');
      setSelectedAvatar(avatarUrl);
      onAvatarUpdated(avatarUrl);
      toast.success(`Avatar updated to ${avatarName}!`);
      onOpenChange(false);
    } catch (error: any) {
      console.error('Update error:', error);
      toast.error(error.message || 'Failed to update avatar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Choose Your Avatar</DialogTitle>
          <DialogDescription>
            Upload a custom photo or select from our preset avatars
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Upload Custom Photo */}
          <div className="space-y-3">
            <h3 className="text-sm">Upload Custom Photo</h3>
            <div className="flex gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading}
              />
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || saving}
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Photo
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Max 2MB • JPEG, PNG, or WebP
            </p>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or choose a preset
              </span>
            </div>
          </div>

          {/* Preset Avatars Grid */}
          <div className="space-y-3">
            <h3 className="text-sm">Preset Avatars - Animals & Nature</h3>
            <p className="text-xs text-muted-foreground">
              Choose your favorite animal avatar for privacy-friendly identity
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {PRESET_AVATARS.map((avatar, index) => (
                <div key={index} className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => handlePresetSelect(avatar.url, avatar.name)}
                    disabled={saving}
                    className="relative group focus:outline-none"
                  >
                    <div className={`
                      relative rounded-full overflow-hidden border-2 transition-all
                      ${selectedAvatar === avatar.url 
                        ? 'border-primary scale-110 shadow-lg' 
                        : 'border-transparent hover:border-primary/50 hover:scale-105'
                      }
                    `}>
                      <Avatar className="w-full h-full">
                        <AvatarImage src={avatar.url} alt={avatar.name} />
                        <AvatarFallback>{avatar.name.split(' ')[0]}</AvatarFallback>
                      </Avatar>
                    </div>
                    {selectedAvatar === avatar.url && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-primary text-primary-foreground rounded-full p-1">
                          <Check className="h-3 w-3" />
                        </div>
                      </div>
                    )}
                  </button>
                  <span className="text-xs text-center text-muted-foreground">
                    {avatar.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
