document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
      logoutButton.addEventListener('click', () => {
        console.log('Кнопка нажата');
        window.location.href = '/auth/logout';
      });
    }
  });
  