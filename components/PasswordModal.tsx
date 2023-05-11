import { useState } from 'react';
import styles from './PasswordModal.module.css'; 

type PasswordModalProps = {
  onSubmit: (password: string) => void;
};

function PasswordModal({ onSubmit }: PasswordModalProps) {
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(password);
    setPassword(''); // Clear the password field
  };

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalContent}>
        <form onSubmit={handleSubmit}>
          <label>
            Enter password:
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={styles.inputField}
            />
          </label>
          <button type="submit" className={styles.submitButton}>Submit</button>
        </form>
      </div>
    </div>
  );
}
export default PasswordModal;
