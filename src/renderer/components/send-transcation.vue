<template>
    <section>
        <mu-text-field :maxLength="20" :multiLine="true" :rows="5" class=" inputdata" hintText="输入要发送的内容"
                       type="text" v-model="sendTo.input">
        </mu-text-field>

        <mu-button @click="confirm()">提交上链</mu-button>

        <div class="modal confirm" v-if="showConfirm">
            <div class="modal-main">
                <div class="modal-content">
                    <p class="inputb">
                        <el-input class="input-psw" placeholder='输入私钥密码' type="password"
                                  v-model.trim="sendTo.psw" @keyup.enter.native="send" ></el-input>
                    </p>
                </div>
                <div class="modal-btn">
                    <el-button :disabled="!sendTo.psw" @click="send" class="subBtn"
                               type="primary">确认发送>>>
                    </el-button>
                </div>
            </div>
        </div>


        <mu-list class="listdata" v-for="tx in tx_logs" >
            <mu-list-item class="listdata1">
            <span @click="openBrowser(tx.hash)" >{{toDate(tx.tradeTime)}} : {{tx.input}}</span>
            <!--<span class="status" color="#880e4f" >{{getStatus(tx.hash)}}</span>-->
            <!--<mu-icon class="status" color="#880e4f" :value="getStatus(tx.hash)">-->
            <!--</mu-icon>-->
            </mu-list-item>
        </mu-list>
    </section>
</template>
<style scoped>
    .inputdata {
        width: 400px;
        margin-left: 10%;
        margin-top: 10%;
    }

    .listdata {
        width: 700px;
    }

    .listdata1 {
        width: 650px;
        display: inline-block;
        margin: auto;
    }

    .status {
    }
</style>
<style lang="less" scoped>
    .font16 {
        font-size: 16px;
    }

    .send-transcation {
        height: calc(~"100% - 70px");
    }

    .cur {
        cursor: pointer;
    }

    .send {
        float: right;
    }

    .send-slider {
        display: block;
        width: 445px;
    }

    .send-content {
        height: 100%;
        box-sizing: border-box;
        margin: 0 auto;
        padding-top: 20px;
        padding-left: 14px;
        font-size: 12px;
        color: #525768;

        .el-input-group__append {
            position: relative;
        }

        .more {
            color: #24272b;

            i {
                font-size: 10px;
            }
        }

        .total-box {
            position: absolute;
            bottom: 12px;
            width: calc(~"100% - 240px");
            /*height: 60px;*/
            line-height: 60px;
            color: #24272b;

            .el-button {
                // position:absolute;
                // right:20px;
                // top: 14px;
                width: 79px;
                height: 32px;
                padding: 0;
            }
        }

        .total-num {
            font-size: 14px;
            border-bottom: solid 1px #D3D8E1;
            height: auto;

            > .font16 {
                margin: 10px 0 14px;
                height: 22px;
                line-height: 22px;
            }
        }

        .share-info {
            /*position: absolute;*/
            bottom: 0;
            /*height: 12px;*/
            font-size: 12px;
            color: #9EABBE;
            letter-spacing: 0.38px;
            line-height: 17px;
            margin-bottom: 14px;
            display: block;
        }

        .total-text {
            height: 20px;
            line-height: 20px;
        }

    }

    .send-transcation-form {
        width: 750px;
    }

    .confirm {
        .modal-main {
            width: 483px;
            font-size: 12px;

            .modal-content {
                // padding:12px;
                .confirm-content {
                    padding: 14px 10px;
                    max-height: 152px;
                    height: auto;
                    background: #ECEFF6;

                    p {
                        color: #24272B;
                        margin-bottom: 9px;

                        .txt {
                            float: right;
                            color: #000000;
                        }
                    }

                    .fee {
                        margin-bottom: 0;
                    }
                }

                .more {
                    margin: 10px;
                    cursor: pointer;

                    i {
                        font-size: 10px;
                    }
                }

                .more-txt {
                    padding-left: 10px;
                    word-break: break-all;
                }

                .inputb {
                    margin: 30px 20px 18px;

                    .el-input {
                        width: 100%;
                    }
                }

                .wallet-share {
                    border-radius: 0;
                }
            }

            .modal-btn {
                // padding-top:7.5px;
                // line-height:1;
                // height:48.5px;
                button {
                    width: 110px;
                    height: 32px;
                    font-size: 12px;
                }
            }
        }
    }

    .el-button.is-disabled {
        background-color: #0077FF;
        opacity: 0.5;
    }

    .append {
        width: 72px;
        letter-spacing: 0;
        font-weight: normal;
    }

    .EnergonCount {
        font-weight: bold;
    }

    .wantTo {
        line-height: 40px;
        padding-left: 10px;

        .black {
            font-size: 14px;
            color: #22272C;
        }
    }
</style>
<style lang="less">
    .send-content {
        .el-form-item__label {
            color: #24272b;
            font-size: 12px !important;
            font-weight: 600;
        }

        .el-form-item__content {
            display: flex;
            align-items: flex-end;
            font-size: 12px !important;
        }

        /*.el-form-item{*/
        /*&:nth-child(1){*/
        /*display: inline-block;*/
        /*}*/
        /*&:nth-child(2){*/
        /*display: inline-block;*/
        /*}*/
        /*}*/

        .el-input {
            font-size: 12px;

            .el-input__inner {
                height: 40px;
            }
        }

        .el-input-group__append {
            color: #fff;
            background: #4897F6;
        }

        .txea {
            margin-top: 10px;
            width: 500px;

            .el-textarea__inner {
                font-size: 11px;
            }
        }

        .gas-input {
            .el-input {
                width: 100px;

                .el-input__inner {
                    height: 32px !important;
                }

            }
        }
    }

</style>


<script>
    import keyManager from '../../services/key-manager'
    import bc from '../../services/bc'
    import {shell} from 'electron'

    export default {
        mounted: function() {
            bc.setProvider('url', this.url, '');
            console.log(bc.isConnected);
            this.tx_logs=bc.readJsonFile(this.logfile).reverse();
            console.log(this.tx_logs)
        },
        name: 'Send',
        data() {
            return {
                fromW: {
                    address: '',
                },
                sendTo: {
                    to: '0xad18b4f17224331f9e1963ff16a908871c8407b8',
                    value: '0',
                    input: '',
                    psw: ''
                },
                url: 'http://172.31.16.185:7793',
                gas: 210000,
                gasPrice: 1000000000,
                showConfirm: false,
                sendLoading: false,
                keyfile: __dirname + '/../../../key.json',
                logfile: __dirname + '/../../../txn.json',
                tx_logs:[],
            }
        },
        methods: {
            toDate(timestamp){
                return new Date(parseInt(timestamp)).toLocaleString();
            },
            getStatus(tx_hash){
                return bc.web3.eth.getTransactionReceipt(tx_hash).status;
            },

            openBrowser(tx_hash){
              let href="https://scan.platon.network/trade-detail?txHash="+tx_hash;
              shell.openExternal(href);

            },
            confirm() {
                this.sendTo.psw = '';
                this.showConfirm = true
            },
            send() {
                console.log('PrivateKey--->',this.keyfile);
                let dataToObj = bc.readJsonFile(this.keyfile);
                this.fromW.address = dataToObj.address;
                // console.log(this.fromW.address);
                let transParam = {
                    value: Number(bc.web3.toWei(this.sendTo.value, 'ether')),
                };

                keyManager.recover2(dataToObj, this.sendTo.psw, 'hex', (err, data) => {
                    // console.warn('private---',err,data);
                    if (err) {
                        this.$message.error('密码错误');
                        return
                    }
                    let priKey = data;
                    this.sendLoading = true;
                    bc.sendTransaction(this.fromW.address, this.sendTo.to, transParam.value, priKey, this.sendTo.input, this.gas, this.gasPrice, (errCode, result) => {
                        // console.warn('Txhash--->', errCode, !!errCode, result);
                        this.sendLoading = false;
                        if (!!errCode && errCode === 2) {
                            return
                        } else if (!!errCode) {
                            this.$message.error('wallet.transactionFailed');
                            return
                        }
                        let tradeObj = {
                            tradeTime: new Date().getTime(),
                            hash: result ? result : 'txn_hash',
                            value: this.sendTo.value,
                            gasPrice: this.gasPrice,
                            input: this.sendTo.input,
                            from: this.fromW.address,
                            to: this.sendTo.to,
                            type: 'transfer'
                        };
                        bc.saveTractRecord(tradeObj, this.logfile).then(() => {
                            this.showConfirm = false;
                            this.$router.push('/')
                        })
                    })
                })
            }
        }
    }
</script>




