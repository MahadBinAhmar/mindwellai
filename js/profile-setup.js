// js/profile-setup.js
// Page: pages/profile-setup.html
// Profile photo upload and form handling
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    if (!window.auth) return;
    window.auth.requireAuth('login.html');

    const user = window.auth.getCurrentUser();
    if (!user) return;

    // Pre-fill fields (use explicit ids)
    const age = document.getElementById('age');
    const gender = document.getElementById('gender');
    const bio = document.getElementById('bio');

    if(age) age.value = user.profile.age || age.value || '';
    if(gender) gender.value = user.profile.gender || gender.value || gender.options[0].value;
    if(bio) bio.value = user.profile.bio || bio.value || '';
    const form = document.getElementById('profile-form');
    const photoInput = document.getElementById('profile-photo');
    if(!form) return;

    // handle photo upload
    const preview = document.getElementById('profile-preview');
    if(preview && user.profile && user.profile.photo){
      preview.src = user.profile.photo;
    }

    if(photoInput){
      photoInput.addEventListener('change', function(e){
        const file = e.target.files && e.target.files[0];
        if(!file) return;
        const reader = new FileReader();
        reader.onload = function(){
          const dataUrl = reader.result;
          // save immediately into profile
          window.auth.saveProfile({ photo: dataUrl });
          // show preview (if present)
          const avatar = document.getElementById('profile-avatar');
          if(avatar) avatar.src = dataUrl;
          if(preview) preview.src = dataUrl;
        };
        reader.readAsDataURL(file);
      });

      // remove photo
      const removeBtn = document.getElementById('remove-photo-btn');
      if(removeBtn){
        removeBtn.addEventListener('click', function(e){
          e.preventDefault();
          window.auth.saveProfile({ photo: '' });
          const avatar = document.getElementById('profile-avatar');
          if(avatar) avatar.src = '../assets/profile-ali.png';
          if(preview) preview.src = '../assets/profile-ali.png';
        });
      }
    }

    form.addEventListener('submit', function(e){
      e.preventDefault();
      const newProfile = {};
      if (age) newProfile.age = age.value;
      if (gender) newProfile.gender = gender.value;
      if (bio) newProfile.bio = bio.value;

      window.auth.saveProfile(newProfile);
      // Continue to assessment
      window.location.href = 'assessment.html';
    });
  });
})();
