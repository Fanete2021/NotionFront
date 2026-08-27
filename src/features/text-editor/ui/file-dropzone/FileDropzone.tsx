import styles from './FileDropzone.module.css';
import ImageIcon from '@shared/assets/icons/image-icon.svg';
import { Typography } from '@shared/ui/Typography';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
}

export const FileDropzone = ({ onFileSelect }: FileDropzoneProps) => {
  const handleUploadFile = (file?: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      return;
    }

    onFileSelect(file);
  };

  return (
    <label
      className={styles.filepickerLabel}
      data-isolate-block="true"
      onDragOver={(event) => {
        event.preventDefault();
      }}
      onDrop={(event) => {
        event.preventDefault();
        handleUploadFile(event.dataTransfer.files[0]);
      }}
    >
      <div className={styles.dropzone}>
        <ImageIcon className={styles.icon} />
        <Typography variant="text-label">
          Перетащите изображение сюда или нажмите, чтобы загрузить
        </Typography>
        <Typography variant="caption">PNG, JPG, GIF до 10 МБ</Typography>
      </div>
      <input
        hidden
        type="file"
        name="filepicker"
        accept="image/png, image/jpeg, image/gif"
        size={MAX_FILE_SIZE}
        onChange={(event) => {
          handleUploadFile(event.target.files?.[0]);
        }}
      />
    </label>
  );
};
