export type dataSignupType = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
};

export type dataSigninType = {
  identifier: string;
  password: string;
};

export type HttpErrorResponseType = {
  status: number;
  error: { message: string | string[] };
};

export type resSigninType = {
  message: string;
  role: string;
  user: string;
};
export type resMessageType = {
  message: string;
};

export type dataForgetPasswordType = {
  email: string;
};

export type dataResetPasswordType = {
  password: string;
  confirmPassword: string;
};
export type myAccountType = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
};
export type resMyAccountType = {
  data: myAccountType;
};
export type resProjectMessage = {
  res: messageType;
  data: messageType[];
  isModerator: boolean;
  user: string;
};
export type messageType = {
  id: string;
  message: string;
  user: { username: string };
  createdAt: string;
  updatedAt: string;
};
export type messageSocketType = {
  action: string;
  message: messageType;
};

export type resSectionType = {
  data: sectionType[];
  isModerator: boolean;
  isAdmin: boolean;
};
export type sectionType = {
  id: string;
  name: string;
  isArchive: boolean;
  projectId: string;
};
export type formSectionType = {
  name: string;
};
