import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

export async function uploadFile(file: File): Promise<{ file_id: string; filename: string }> {
  const form = new FormData();
  form.append('file', file);
  const { data } = await api.post('/upload/', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (evt) => {
      // progress handled in component via Axios interceptors if needed
    },
  });
  return data;
}

export default api;
