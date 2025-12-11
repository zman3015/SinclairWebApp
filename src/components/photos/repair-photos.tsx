"use client"

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Upload,
  Trash2,
  ZoomIn,
  Loader2,
  Image as ImageIcon
} from 'lucide-react'
import { Photo } from '@/lib/models/photo'
import { toast } from 'sonner'

interface RepairPhotosProps {
  beforePhotos: Photo[]
  afterPhotos: Photo[]
  uploading: boolean
  uploadProgress: number
  canUpload?: boolean
  canDelete?: boolean
  onUploadBefore: (file: File) => Promise<void>
  onUploadAfter: (file: File) => Promise<void>
  onDelete: (photoId: string) => Promise<void>
}

export function RepairPhotos({
  beforePhotos,
  afterPhotos,
  uploading,
  uploadProgress,
  canUpload = true,
  canDelete = true,
  onUploadBefore,
  onUploadAfter,
  onDelete
}: RepairPhotosProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [photoToDelete, setPhotoToDelete] = useState<Photo | null>(null)
  const beforeFileInputRef = useRef<HTMLInputElement>(null)
  const afterFileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
    isBefore: boolean
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      if (isBefore) {
        await onUploadBefore(file)
        toast.success('Before photo uploaded successfully!')
      } else {
        await onUploadAfter(file)
        toast.success('After photo uploaded successfully!')
      }
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      toast.error(error.message || 'Failed to upload photo')
    }

    // Reset input
    const ref = isBefore ? beforeFileInputRef : afterFileInputRef
    if (ref.current) {
      ref.current.value = ''
    }
  }

  const handleDeleteClick = (photo: Photo) => {
    setPhotoToDelete(photo)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!photoToDelete?.id) return

    try {
      await onDelete(photoToDelete.id)
      toast.success('Photo deleted successfully!')
      setDeleteDialogOpen(false)
      setPhotoToDelete(null)
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      toast.error(error.message || 'Failed to delete photo')
    }
  }

  const renderPhotoSection = (
    photos: Photo[],
    title: string,
    isBefore: boolean,
    fileInputRef: React.RefObject<HTMLInputElement>,
    onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  ) => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          {title}
          <Badge variant="outline" className="ml-2">
            {photos.length}
          </Badge>
        </h3>
        {canUpload && (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={onFileSelect}
              className="hidden"
              disabled={uploading}
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {photos.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <ImageIcon className="h-10 w-10 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">No {isBefore ? 'before' : 'after'} photos yet</p>
          {canUpload && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="mt-2"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Photo
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group">
              <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100 cursor-pointer">
                <Image
                  src={photo.downloadURL}
                  alt={photo.fileName}
                  fill
                  className="object-cover hover:scale-105 transition-transform"
                  onClick={() => setSelectedPhoto(photo)}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setSelectedPhoto(photo)}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  {canDelete && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteClick(photo)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="mt-1 text-xs text-gray-500 truncate">
                {photo.uploadedByName}
              </div>
              <div className="text-xs text-gray-400">
                {new Date(photo.uploadedAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ImageIcon className="h-5 w-5 mr-2" />
            Repair Photos
            <Badge variant="outline" className="ml-2">
              {beforePhotos.length + afterPhotos.length} total
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Upload Progress */}
          {uploading && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Uploading...</span>
                <span className="text-sm font-medium">{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}

          {/* Before/After Tabs */}
          <Tabs defaultValue="before" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="before">
                Before ({beforePhotos.length})
              </TabsTrigger>
              <TabsTrigger value="after">
                After ({afterPhotos.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="before" className="mt-4">
              {renderPhotoSection(
                beforePhotos,
                'Before Repair',
                true,
                beforeFileInputRef,
                (e) => handleFileSelect(e, true)
              )}
            </TabsContent>
            <TabsContent value="after" className="mt-4">
              {renderPhotoSection(
                afterPhotos,
                'After Repair',
                false,
                afterFileInputRef,
                (e) => handleFileSelect(e, false)
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Photo Viewer Dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {selectedPhoto?.isBeforePhoto ? 'Before Repair' : 'After Repair'}
            </DialogTitle>
            <DialogDescription>
              Uploaded by {selectedPhoto?.uploadedByName || 'Unknown'} on{' '}
              {selectedPhoto && new Date(selectedPhoto.uploadedAt).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          {selectedPhoto && (
            <div className="relative w-full" style={{ maxHeight: '70vh' }}>
              <Image
                src={selectedPhoto.downloadURL}
                alt={selectedPhoto.fileName}
                width={selectedPhoto.width || 800}
                height={selectedPhoto.height || 600}
                className="w-full h-auto rounded-lg"
                style={{ maxHeight: '70vh', objectFit: 'contain' }}
              />
            </div>
          )}
          <DialogFooter>
            <div className="flex items-center justify-between w-full">
              <div className="text-sm text-gray-500">
                {selectedPhoto?.fileName} ({Math.round((selectedPhoto?.size || 0) / 1024)}KB)
              </div>
              <div className="flex gap-2">
                {canDelete && selectedPhoto && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setSelectedPhoto(null)
                      handleDeleteClick(selectedPhoto)
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                )}
                <Button variant="outline" onClick={() => setSelectedPhoto(null)}>
                  Close
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Photo</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this{' '}
              {photoToDelete?.isBeforePhoto ? 'before' : 'after'} photo? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {photoToDelete && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden">
              <Image
                src={photoToDelete.downloadURL}
                alt={photoToDelete.fileName}
                fill
                className="object-cover"
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Photo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
