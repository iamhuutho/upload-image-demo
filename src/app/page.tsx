'use client';

import { useState, useEffect } from 'react';
import { Upload, Button, Input, List, Form, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

export default function Home() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [selectedPhotoId, setSelectedPhotoId] = useState<number | null>(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const res = await axios.get('/api/photo');
      setPhotos(res.data);
    } catch (err) {
      message.error('Failed to fetch photos');
    }
  };

  const handleUpload = async ({ file }: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      const fileName = file.name;
      const fileType = file.type;

      try {
        // Uploading photo to the API
        const res = await axios.post('/api/photo', {
          file: base64, 
          fileName,
          fileType,
        });

        // Assuming the API responds with the uploaded photo details
        const newPhoto = {
          id: res.data.id, // Use the ID returned from your API
          url: res.data.url, // Use the URL returned from your API
          comments: [], // Initialize with an empty comments array
        };

        // Update the photos state without refetching
        setPhotos((prevPhotos) => [...prevPhotos, newPhoto]);

        message.success('Photo uploaded successfully');
        window.location.reload();
      } catch (error) {
        message.error('Failed to upload photo');
      }
    };
  };

  const handleCommentSubmit = async (photoId: number) => {
    if (newComment.trim()) {
      try {
        await axios.post('/api/comment', { photoId, text: newComment });
        message.success('Comment added');
        setNewComment('');
        setSelectedPhotoId(null);
        fetchPhotos(); // You may want to fetch again to get updated comments
      } catch (err) {
        message.error('Failed to add comment');
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Photo Gallery</h1>

      <Upload customRequest={handleUpload}>
        <Button icon={<UploadOutlined />}>Upload Photo</Button>
      </Upload>

      <List
        itemLayout="vertical"
        dataSource={photos}
        renderItem={(photo) => (
          <List.Item key={photo.id}>
            <img src={photo.url} alt="uploaded photo" style={{ width: '200px' }} />
            <List
              itemLayout="horizontal"
              dataSource={photo.comments}
              renderItem={(comment: any) => <List.Item>{comment.text}</List.Item>}
            />
            {selectedPhotoId === photo.id ? (
              <Form onFinish={() => handleCommentSubmit(photo.id)}>
                <Form.Item>
                  <Input.TextArea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment"
                  />
                </Form.Item>
                <Form.Item>
                  <Button htmlType="submit" type="primary">
                    Submit Comment
                  </Button>
                </Form.Item>
              </Form>
            ) : (
              <Button onClick={() => setSelectedPhotoId(photo.id)}>
                Add Comment
              </Button>
            )}
          </List.Item>
        )}
      />
    </div>
  );
}
