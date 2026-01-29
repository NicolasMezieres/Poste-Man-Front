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
export type resCreateProject = {
  message: string;
  data: { projectId: string };
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
  icon?: string | null;
};
export type resMyAccountType = {
  data: myAccountType;
};
export type resProjectMessage = {
  data: messageType[];
};
export type messageType = {
  id: string;
  message: string;
  isVisible: boolean;
  user: { username: string; id: string };
  createdAt: string;
  updatedAt: string;
};
export type messageSocketType = {
  action: string;
  message: messageType;
  userId?: string;
  isBanned?: boolean;
};
export type postSocketType = {
  action: string;
  post: postType;
  userId: string;
  isBan: boolean;
};
export type resSectionType = {
  data: sectionType[];
  isModerator: boolean;
  isAdmin: boolean;
  projectName: string;
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

export type formPostType = {
  text: string;
};
export type positionPostType = {
  poseX: number;
  poseY: number;
};
export type resPostType = {
  data: postType[];
  isModerator: boolean;
  isAdmin: boolean;
  user: string;
  sectionName: string;
};
export type resEditPostType = {
  message: string;
  data: postType;
};
export type postType = {
  id: string;
  text: string;
  poseX: number;
  poseY: number;
  score: number;
  isVisible: boolean;
  isArchive: boolean;
  createdAt: string;
  updatedAt: string;
  user: userType;
  vote: voteType[];
};
export type userType = {
  username: string;
  id: string;
};
export type voteType = {
  isUp: boolean;
};

export type resSearchProject = {
  total: number;
  isEndList: boolean;
  data: searchProjectType[];
  user: { username: string };
};
export type searchProjectType = {
  name: string;
  id: string;
};
export type querySearchType = {
  page: number;
  search: string;
};
export type querySearchAdminType = {
  page: number;
  search: string;
  fromDate: string;
  toDate: string;
};

export type resSearchProjectByAdmin = {
  total: number;
  isEndList: boolean;
  data: projectByAdmin[];
};
export type projectByAdmin = {
  id: string;
  name: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  totalUser: number;
  totalSection: number;
  totalPost: number;
};

export type nameType = {
  name: string;
};

export type resCreateInvitationLikeType = {
  message: string;
  data: linkType;
};
export type linkType = {
  id: string;
  outdatedAt: Date;
};

export type resGetProjectType = {
  projectName: string;
  isModerator: boolean;
  isAdmin: boolean;
};
export type resGetProjectDetailType = {
  data: {
    author: string;
    totalPost: number;
    totalSection: number;
    updatedAt: string;
    createdAt: string;
    projectName: string;
  };
};
export type projectDetailType = {
  author: string;
  totalPost: number;
  totalSection: number;
  updatedAt: string;
  createdAt: string;
  projectName: string;
};
export type resJoinProjectType = {
  message: string;
  projectId: string;
};

export type resFormSectionType = {
  message: string;
  data: sectionType;
};

export type cardMoveType = {
  id: string;
  poseX: number;
  poseY: number;
};
export type resProjectName = {
  projectName: string;
  isModerator: boolean;
  isAdmin: boolean;
  user: { username: string };
};
export type formChangePassword = {
  oldPassword: string;
  password: string;
  confirmPassword: string;
};

export type member = {
  isBanned: boolean;
  isConnected: boolean;
  user: { username: string; icon: string | null };
  userId: string;
};

export type resListenAuthData = {
  type: string;
  userId: string;
  isConnected?: boolean;
  isBanned?: boolean;
  user?: { username: string; icon: string | null };
};

export type resLogData = {
  message: string;
  isAdmin: boolean;
};

export type reqSearchUserType = {
  search: string;
  page: number;
  isActive: boolean | null;
};
export type resSearchUserType = {
  data: listUserType[];
  totalUser: number;
  isNextPage: boolean;
};
export type listUserType = {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
};
export type resDetailUserType = {
  data: detailUserType;
};
export type detailUserType = {
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  gdpr: boolean;
  createdAt: string;
  updatedAt: string;
  username: string;
};
export type resGetListProject = {
  data: listProjectType[];
  isEndList: boolean;
  totalProject: number;
};
export type listProjectType = {
  name: string;
  moderator: string;
  createdAt: Date;
  updatedAt: Date;
  id: string;
  totalMember: number;
  totalSection: number;
  totalPost: number;
};
