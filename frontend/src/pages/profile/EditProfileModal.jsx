import { useEffect, useState, useRef } from 'react';

const EditProfileModal = ({ authUser }) => {
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    bio: '',
    link: '',
    newPassword: '',
    currentPassword: '',
  });

  const [profileImg, setProfileImg] = useState(null);
  const profileImgRef = useRef(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (authUser) {
      const setForm = () => {
        setFormData({
          fullname: authUser.fullname,
          username: authUser.username,
          email: authUser.email,
          bio: authUser.bio || '',
          link: authUser.link || '',
          newPassword: '',
          currentPassword: '',
        });
      };
      setForm();
    }
  }, [authUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/users/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, profileImg }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');

      localStorage.setItem('authUser', JSON.stringify(data));
      window.location.reload();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCancel = () => {
    // Reset form and close modal
    setFormData({
      fullname: authUser.fullname,
      username: authUser.username,
      email: authUser.email,
      bio: authUser.bio || '',
      link: authUser.link || '',
      newPassword: '',
      currentPassword: '',
    });
    setProfileImg(null);
    document.getElementById('edit_profile_modal').close();
  };

  return (
    <>
      <button
        className="btn btn-outline rounded-full btn-sm"
        onClick={() =>
          document.getElementById('edit_profile_modal').showModal()
        }
      >
        Edit profile
      </button>
      <dialog id="edit_profile_modal" className="modal">
        <div className="modal-box border rounded-md border-gray-700 shadow-md">
          <h3 className="font-bold text-lg my-3 text-white">Update Profile</h3>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col items-center gap-2">
              <div className="avatar">
                <div className="w-24 rounded-full relative group">
                  <img
                    src={
                      profileImg ||
                      authUser?.profileImg ||
                      '/avatar-placeholder.png'
                    }
                  />
                  <div
                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-200"
                    onClick={() => profileImgRef.current.click()}
                  >
                    <span className="text-white text-xs">Change</span>
                  </div>
                </div>
              </div>
              <input
                type="file"
                hidden
                ref={profileImgRef}
                onChange={handleImgChange}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                placeholder="Full Name"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.fullname}
                name="fullname"
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="Username"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.username}
                name="username"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.email}
                name="email"
                onChange={handleInputChange}
              />
              <textarea
                placeholder="Bio"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.bio}
                name="bio"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                type="password"
                placeholder="Current Password"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.currentPassword}
                name="currentPassword"
                onChange={handleInputChange}
              />
              <input
                type="password"
                placeholder="New Password"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.newPassword}
                name="newPassword"
                onChange={handleInputChange}
              />
            </div>
            <input
              type="text"
              placeholder="Link"
              className="flex-1 input border border-gray-700 rounded p-2 input-md"
              value={formData.link}
              name="link"
              onChange={handleInputChange}
            />
            <div className="flex gap-2 justify-end mt-4">
              <button
                type="button"
                className="btn btn-outline rounded-full btn-sm"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary rounded-full btn-sm text-white px-6"
              >
                Update
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button className="outline-none" onClick={handleCancel}>
            close
          </button>
        </form>
      </dialog>
    </>
  );
};
export default EditProfileModal;
