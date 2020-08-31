const { Sequelize } = require('sequelize');

const floating_ipv4 = '<digitalocean_flip>'
const primary_ipv4 = '<pg1_droplet_ipv4>'
const standby_ipv4 = '<pg2_droplet_ipv4>'

const sequelize = new Sequelize('postgres', 'postgres', '123456', {
  dialect: 'postgres',
  port: 5432,
  replication: {
    read: [
      { host: standby_ipv4 },
      { host: primary_ipv4 }
      // witness node has no data, only metadata
    ],
    write: { host: floating_ipv4 }
  },
  pool: {
    max: 10,
    idle: 30000
  },
})

// connect to DB
async function connect() {
  console.log('Checking database connection...');
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

// model
const Country = sequelize.define('Country', {
  country_id: {
    type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true
  },
  name: Sequelize.STRING,
  is_eu_member: Sequelize.BOOLEAN
},
{
  timestamps: false
});

async function create_table() {
  await sequelize.sync({force: true});
  console.log("create table countries")
};

// insert country
async function insertCountry() {
  const pt = await Country.create({ name: "Portugal", is_eu_member: true });
  console.log("pt created - country_id: ", pt.country_id);
}

// select all countries
async function findAllCountries() {
  const countries = await Country.findAll();
  console.log("All countries:", JSON.stringify(countries, null, 2));
}

async function run() {
  await create_table()
  await insertCountry()
  await findAllCountries()
  await sequelize.close();
}

run()
