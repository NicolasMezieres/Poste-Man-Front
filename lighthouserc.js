export const ci = {
  collect: {
    startServerCommand: 'npm run start',
    url: [
      'http://localhost:4200',
      'http://localhost:4200/auth',
      'http://localhost:4200/validAccount',
      'http://localhost:4200/forgetPassword',
      'http://localhost:4200/resetPassword/token',
      'http://localhost:4200/home',
      'http://localhost:4200/home/token',
      'http://localhost:4200/profil',
      'http://localhost:4200/project/id/tchat',
    ],
  },
  upload: {
    target: 'temporary-public-storage',
  },
};
