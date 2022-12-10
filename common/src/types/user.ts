export interface User<Config> {
  id: string;
  name: string;
  configs: Config[];
}
