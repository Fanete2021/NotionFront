import styles from './FileDropzone.module.css';
import ImageIcon from '@shared/assets/icons/image-icon.svg';
import { Typography } from '@shared/ui/Typography';
import { toast } from '@shared/ui/toast';

const ALLOWED_FILE_EXTENSION = 'image/png, image/jpeg, image/gif, video/mp4, video/webm, video/mov';

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  fileSize: number;
  hint: string;
  fileExtensionsHint: string;
  allowedFileType: string;
  allowedFileExtensions: string[];
}

export const FileDropzone = ({
  onFileSelect,
  fileSize,
  hint,
  fileExtensionsHint,
  allowedFileType,
  allowedFileExtensions,
}: FileDropzoneProps) => {
  const handleUploadFile = (file?: File) => {
    if (!file) return;

    if (!file.type.startsWith(allowedFileType)) {
      toast.add({
        type: 'error',
        title: 'Неверный формат файла',
        description: `Допустимые форматы: ${allowedFileExtensions.join(', ')}`,
      });
      return;
    }

    if (file.size > fileSize) {
      toast.add({
        type: 'error',
        title: 'Файл слишком большой',
        description: `Ограничение по размеру: ${fileSize} МБ`,
      });
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
