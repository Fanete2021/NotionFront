import styles from './FileDropzone.module.css';
import ImageIcon from '@shared/assets/icons/image-icon.svg';
import { Typography } from '@shared/ui/Typography';

const ALLOWED_FILE_EXTENSION = 'image/png, image/jpeg, image/gif, video/mp4, video/webm, video/mov';

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  fileSize: number;
  hint: string;
  fileExtensionsHint: string;
  allowedFileType: string;
}

export const FileDropzone = ({
  onFileSelect,
  fileSize,
  hint,
  fileExtensionsHint,
  allowedFileType,
}: FileDropzoneProps) => {
  const handleUploadFile = (file?: File) => {
    if (!file) return;

    if (!file.type.startsWith(allowedFileType)) {
      return;
    }

    if (file.size > fileSize) {
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
        <Typography variant="text-label">{hint}</Typography>
        <Typography variant="caption">{fileExtensionsHint}</Typography>
      </div>
      <input
        hidden
        type="file"
        name="filepicker"
        accept={ALLOWED_FILE_EXTENSION}
        size={fileSize}
        onChange={(event) => {
          handleUploadFile(event.target.files?.[0]);
        }}
      />
    </label>
  );
};
