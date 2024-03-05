import React, { useState } from 'react';
import Link from './Link';

function Banking() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <h1>Banking Route</h1>
      <p>This is your banking route content.</p>
      <button onClick={openModal}>Add Account</button>
      {isModalOpen && <Link onClose={closeModal} />}
    </div>
  );
}

export default Banking;
