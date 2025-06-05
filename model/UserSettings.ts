type SystemMode = 'low' | 'medium' | 'high';

type UserSettingsType = {
  hasLoggedInBefore: boolean;
  name: string;
  nickname: string;
  systemMode: SystemMode;
};

const UserSettings: UserSettingsType = {
  hasLoggedInBefore: false,
  name: '',
  nickname: '',
  systemMode: 'medium',
};

export default UserSettings;
