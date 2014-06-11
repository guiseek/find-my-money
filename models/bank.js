var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/find-my-money');

var db = mongoose.connection;
db.on('error', function(err){
    console.log('Erro de conexao.', err)
});
db.once('open', function () {
  console.log('Conexão aberta.')
});

var Schema = mongoose.Schema;

var BankSchema = new Schema({
  name: { type: String, default: '' },
  description: { type: String, default: '' },
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  estate: { type: String, default: '' },
  country: { type: String, default: '' },
  lat: { type: Number },
  lng: { type: Number },
  cashMachine: { type: Boolean },
  created: { type: Date, default: Date.now }
});

exports.model = mongoose.model('Bank', BankSchema);
