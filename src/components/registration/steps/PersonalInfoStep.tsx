
import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Upload } from 'lucide-react';
import { Driver } from '@/types/driver';
import { useDocumentUpload } from '@/hooks/useDocumentUpload';

interface PersonalInfoStepProps {
  data: Partial<Driver>;
  onChange: (data: Partial<Driver>) => void;
  onNext: () => void;
  isLoading: boolean;
}

const PersonalInfoStep = ({ data, onChange, onNext, isLoading }: PersonalInfoStepProps) => {
  const { uploadDocument } = useDocumentUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleInputChange = (field: keyof Driver, value: string) => {
    onChange({ [field]: value });
  };

  const handlePhotoUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadDocument('profile_photo', file);
      if (url) {
        onChange({ profile_photo_url: url });
      }
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handlePhotoUpload(file);
    }
  };

  const isFormValid = () => {
    return (
      data.name &&
      data.gender &&
      data.date_of_birth &&
      data.email &&
      data.national_id_number &&
      data.profile_photo_url
    );
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-700 border-gray-600">
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
          
          {/* Profile Photo */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={data.profile_photo_url} />
              <AvatarFallback className="bg-gray-600 text-white text-xl">
                {data.name ? data.name.charAt(0).toUpperCase() : <Camera />}
              </AvatarFallback>
            </Avatar>
            
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center space-x-2"
            >
              <Upload className="h-4 w-4" />
              <span>{uploading ? 'Uploading...' : 'Upload Photo'}</span>
            </Button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-gray-200">Full Name *</Label>
              <Input
                id="name"
                value={data.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="bg-gray-600 border-gray-500 text-white"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <Label htmlFor="gender" className="text-gray-200">Gender *</Label>
              <Select value={data.gender || ''} onValueChange={(value) => handleInputChange('gender', value)}>
                <SelectTrigger className="bg-gray-600 border-gray-500 text-white">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="dob" className="text-gray-200">Date of Birth *</Label>
              <Input
                id="dob"
                type="date"
                value={data.date_of_birth || ''}
                onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                className="bg-gray-600 border-gray-500 text-white"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-200">Email *</Label>
              <Input
                id="email"
                type="email"
                value={data.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="bg-gray-600 border-gray-500 text-white"
                placeholder="your.email@example.com"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="national_id" className="text-gray-200">National ID Number *</Label>
              <Input
                id="national_id"
                value={data.national_id_number || ''}
                onChange={(e) => handleInputChange('national_id_number', e.target.value)}
                className="bg-gray-600 border-gray-500 text-white"
                placeholder="Enter your national ID number"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              onClick={onNext}
              disabled={!isFormValid() || isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Continue to License Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalInfoStep;
