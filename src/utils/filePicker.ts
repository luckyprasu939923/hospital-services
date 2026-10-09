import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

export interface PickedFile {
  name: string;
  uri: string;
  mimeType?: string;
  size?: number;
}

/**
 * Opens the device's native file/image picker allowing the user to choose
 * documents (PDF) or photos/images (JPG, PNG, etc.) directly from their phone storage.
 */
export async function pickDocumentOrImage(): Promise<PickedFile | null> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/*'],
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selected = result.assets[0];
      return {
        name: selected.name,
        uri: selected.uri,
        mimeType: selected.mimeType,
        size: selected.size,
      };
    }
  } catch (error) {
    console.warn('Document picker cancelled or failed:', error);
  }
  return null;
}

/**
 * Opens the device's native photo library allowing the user to select or crop a doctor photo directly from their phone.
 */
export async function pickPhotoFromGallery(): Promise<PickedFile | null> {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      return {
        name: asset.fileName || 'doctor_profile.jpg',
        uri: asset.uri,
        mimeType: asset.mimeType || 'image/jpeg',
        size: asset.fileSize,
      };
    }
  } catch (error) {
    console.warn('Image picker error, falling back to document picker:', error);
    try {
      const docResult = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
        copyToCacheDirectory: true,
        multiple: false,
      });
      if (!docResult.canceled && docResult.assets && docResult.assets.length > 0) {
        const item = docResult.assets[0];
        return {
          name: item.name,
          uri: item.uri,
          mimeType: item.mimeType,
          size: item.size,
        };
      }
    } catch (e) {
      console.warn('Fallback document image picker failed:', e);
    }
  }
  return null;
}

