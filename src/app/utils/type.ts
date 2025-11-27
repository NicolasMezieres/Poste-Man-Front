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
