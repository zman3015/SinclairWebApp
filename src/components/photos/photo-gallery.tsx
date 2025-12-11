"use client"

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
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
  Image as ImageIcon,
  X
} from 'lucide-react'
import { Photo } from '@/lib/models/photo'
import { toast } from 'sonner'

interface PhotoGalleryProps {
  photos: Photo[]
  title: string
  uploading: boolean
  uploadProgress: number
  canUpload?: boolean
  canDelete?: boolean
  onUpload: (file: File) => Promise<void>
  onDelete: (photoId: string) => Promise<void>
  emptyMessage?: string
}

export function PhotoGallery({
  photos,
  title,
  uploading,
  uploadProgress,
  canUpload = true,
  canDelete = true,
  onUpload,
  onDelete,
  emptyMessage = 'No photos yet'
}: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [photoToDelete, setPhotoToDelete] = useState<Photo | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      await onUpload(file)
      toast.success('Photo uploaded successfully!')
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      toast.error(error.message || 'Failed to upload photo')
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
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

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <ImageIcon className="h-5 w-5 mr-2" />
              {title}
              <Badge variant="outline" className="ml-2">
                {photos.length}
              </Badge>
            </CardTitle>
            {canUpload && (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={uploading}
                />
                <Button
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="bg-dental-blue hover:bg-dental-blue/90"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Photo
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
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

          {/* Photo Grid */}
          {photos.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">{emptyMessage}</p>
              {canUpload && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload First Photo
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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

                    {/* Overlay with actions */}
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

                  {/* Photo info */}
                  <div className="mt-2 text-xs text-gray-500 truncate">
                    {photo.uploadedByName || 'Unknown'}
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(photo.uploadedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Photo Viewer Dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Photo Details</DialogTitle>
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
              Are you sure you want to delete this photo? This action cannot be undone.
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
