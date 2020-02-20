const Web3 = require('web3');
const Tx = require('ethereumjs-tx');
var fs = require('fs');


const bc = {
    readJsonFile(keyfilePath) {
        var keyfile = fs.readFileSync(keyfilePath, {encoding: 'utf8'});
        return JSON.parse(keyfile.toString().replace(/\n\r/g, ''))
    },

    constructor() {
        this.web3 = null;
        this.cid = '';
        this.isConnected = false; //连接状态

        this.timeout = 60; //超时时间
    },

    /**
     * 通过web3发送交易
     * @param from  发起方
     * @param to    接收方
     * @param value   金额（number类型）
     * @param priKey  发起方私钥（buffer类型）
     * @param input   data
     * @param gas
     * @param gasPrice
     * @param cb
     */
    sendTransaction(from, to, value, priKey, input, gas, gasPrice, cb) {
        console.log('SendTransaction-->', from, to, value, priKey, input, gas, gasPrice)
        //_from为发起交易的地址
        var _from = from;
        //nonce随机数，这里取该账号的交易数量
        var number;
        this.web3.eth.getTransactionCount(_from, (err, data) => {
            // console.warn('getTransactionCount',err,data);
            if (err) {
                throw err
            }
            number = data.toString(16);
            var privateKey = new Buffer(priKey, 'hex');
            var rawTx = {
                nonce: '0x' + number,//随机数
                // gas:'0x'+90000,
                gas: this.web3.toHex(gas),
                // gasPrice:'0x'+((gasPrice).toString(16)),
                gasPrice: this.web3.toHex(gasPrice),
                to: to,//接受方地址或者合约地址
                // value: '0x'+((value).toString(16)),
                value: this.web3.toHex(value),
                data: this.web3.toHex(input),
            };
            try {
                //使用私钥对原始的交易信息进行签名，得到签名后的交易数据
                // console.warn('--->', rawTx);
                var tx = new Tx(rawTx);
                tx.sign(privateKey);
                var serializedTx = tx.serialize();
                var RawTransData='0x' + serializedTx.toString('hex');
                console.log('RawTranscationData--->',RawTransData);
                this.web3.eth.sendRawTransaction(RawTransData, function (err, hash) {
                    if (!err) {
                        console.log('TxHash---->', err, hash);
                        cb(0, hash)
                    } else {
                        if (err.toString().indexOf('insufficient funds for gas * price + value') !== -1) {
                            this.$message.warning('wallet.cannotTrans2');
                            cb(2, err);
                            return
                        }
                        cb(1, err)
                    }
                })
            } catch (e) {
                cb(1, err)
            }
        })
    },
    //保存交易记录
    saveTractRecord(tradeObj, path) {
        return new Promise((resolve, reject) => {
            fs.exists(path, (exists) => {
                if (exists) {
                    let data = fs.readFileSync(path, {encoding: 'utf8'});
                    let dataArr = [];
                    dataArr = data ? JSON.parse(data) : [];
                    dataArr.push(tradeObj);
                    fs.writeFile(path, JSON.stringify(dataArr), function (err) {
                        if (err) {
                            reject();
                            throw err
                        } else {
                            resolve()
                        }
                    })
                } else {
                    let arr = [];
                    arr.push(tradeObj);
                    fs.writeFile(path, JSON.stringify(arr), (err) => {
                        if (err) {
                            reject();
                            throw err
                        } else {
                            resolve()
                        }
                    })
                }
            })
        })
    },


    /**
     * 获取链ID
     */
    getCid() {
        return new Promise((resolve, reject) => {
            this.web3.version.getNetwork((err, res) => {
                if (err) {
                    reject(err);
                } else {
                    this.cid = res;
                    resolve(res);
                }
            })
        });
    },

    setProvider(mode, url, ipcFile) {
        return new Promise((resolve, reject) => {
            if (mode === 'ipc') {
                try {
                    const client = net.Socket();
                    const web3 = new Web3(new Web3.providers.IpcProvider(ipcFile, client));
                    this.web3 = web3;
                    this.getCid();
                    this.isConnected = true;
                    resolve();
                } catch (e) {
                    this.isConnected = false;
                    reject(e);
                }
            } else {
                this.provider = url;
                try {
                    console.warn('Connect to url-->', url);
                    this.web3 = new Web3(new Web3.providers.HttpProvider(this.provider));
                    this.getCid();
                    this.isConnected = this.web3.isConnected();
                    resolve();
                } catch (e) {
                    this.isConnected = false;
                    reject(e);
                }
            }
        });
    }


};

export default bc
