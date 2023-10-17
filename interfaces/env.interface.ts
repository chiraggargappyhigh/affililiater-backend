enum NODE_ENV {
  development = "development",
  production = "production",
  test = "test",
}

interface ENV {
  node_env?: NODE_ENV;
  port?: number;
  mongo_uri?: string;
  cryptoSecret?: string;
}

type Config = Required<ENV>;

export { Config, ENV, NODE_ENV };
