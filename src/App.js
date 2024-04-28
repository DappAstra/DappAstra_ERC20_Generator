import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as React from 'react';
import Card from'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';

const { ethers } = require('ethers')

const contract_data = require('./contract_data/ERC20.json');

function App() {

  console.log(ethers.version)

  const [account, setAccount] = useState(null)
  const [signer, setSigner] = useState(null)
  const [provider, setProvider] = useState(null)
  const [isWaiting, setIsWaiting] = useState(false)

  const [decimals, setDecimals] = useState(18)
  const [symbol, setSymbol] = useState(null)
  const [name, setName] = useState(null)
  const [supply, setSupply] = useState(null)

  const [isLoading, setIsLoading] = useState(true)

  const loadBlockchainData = async () => {
    // Initiate provider
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    setIsLoading(false)
  }

  const deployERC20 = async (e) => {

    console.log(decimals, symbol, name, supply)

    const factory = new ethers.ContractFactory(contract_data.abi, contract_data.bytecode, signer);
    const contract = await factory.connect(signer).deploy(decimals.toString(), symbol.toString(), name.toString(), ethers.utils.parseUnits(supply, decimals));

    console.log(contract.address);
    console.log(contract.deployTransaction);
    
  }

  const loadAccount = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = ethers.utils.getAddress(accounts[0])
    setAccount(account)

    const signer = await provider.getSigner()
    setSigner(signer)
  }

  useEffect(() => {
    if (isLoading) {
      loadBlockchainData()
    }
  }, [isLoading]);

  return(
    <>  
      <div style={{display: 'inline-block'}}>
        <Card style={{maxWidth:'450px', minWidth: '450px', maxHeight:'450px', minHeight: '450px', display: 'inline-block', margin: '25px', backgroundColor: 'white', borderRadius: '12px'}}>
            <div>
              <div style={{margin:'50px', display: 'inline-block'}}>
                <h2 style={{marginBottom: '30px'}}>ERC20 Token Generator</h2>
                <Form onSubmit={deployERC20}>
                  <Form.Group className="text-center" style={{maxWidth:'450px', margin: '5px auto'}}>
                    Token Name <Form.Control style={{width:'100%'}} type='text' placeholder='Token Name' className='my-2' onChange={(e) => setName(e.target.value)}/>
                    <br/> Token Symbol <Form.Control style={{width:'100%'}} type='text' placeholder='Token Symbol' className='my-2' onChange={(e) => setSymbol(e.target.value)}/>
                    <br/> Total Supply <Form.Control style={{width:'100%'}} type='number' step='1' placeholder='Total Supply' className='my-2' onChange={(e) => setSupply(e.target.value)}/>
                    <br/> Decimal Precision <Form.Control style={{width:'100%'}} value={decimals} type='number' step='1' placeholder='Decimal Precision' className='my-2' onChange={(e) => setDecimals(e.target.value)}/>
                    
                    {isWaiting? (
                      <>
                        <Spinner animation='border' style={{marginTop: '20px'}} />
                        <p>Loading...</p>
                      </>
                    ) : (
                      <>
                        {account ? (
                          <Button
                            variant='primary'
                            type='button'
                            style={{marginTop: '20px'}}
                            onClick={() => deployERC20()}
                          >
                            Deploy ERC20
                          </Button>
                        ) : (
                          <Button
                            variant='primary'
                            type='button'
                            style={{marginTop: '20px'}}
                            onClick={() => loadAccount()}
                          >
                            Connect Wallet
                          </Button>
                        )}
                      </>
                    )}          
                  </Form.Group>
                </Form>
              </div>
            </div>
        </Card>
      </div>
    </>
  );
}

export default App;
