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
      'http://localhost:4200/project/id',
      'http://localhost:4200/project/id/tchat',
      'http://localhost:4200/project/id/section',
      'http://localhost:4200/project/projectId/section/sectionId',
      'http://localhost:4200/project/linkId/join',
      'http://localhost:4200/500',
      'http://localhost:4200/mentions',
      'http://localhost:4200/listProject',
      'http://localhost:4200/detailProject/projectId',
      'http://localhost:4200/detailUser/userId',
    ],
  },
  upload: {
    target: 'temporary-public-storage',
  },
};
