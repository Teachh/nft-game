Moralis.initialize("rTnLQzZjnVFQ15T8hZ3djOi4mshYba14EdqY8bcc"); // Application id from moralis.io
Moralis.serverURL = "https://d5mxmv8zijay.grandmoralis.com:2053/server"; //Server url from moralis.io

const CONTRACT_ADDRESS = "0x22D13bC93778Fc176412E226d02157f9D5FfbE63";
async function login() {
    try {
        currentUser = Moralis.User.current();
        if(!currentUser){
            currentUser = await Moralis.Web3.authenticate();
        }
    } catch (error) {
        console.log(error);
    }
}
async function renderGame(){
    $('#login_button').hide();
    // Get and Render prop from SmartContract
    let petId = 0;
    window.web3 = await Moralis.Web3.enable();
    let abi = await getAbi();
    let contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
    let data = await contract.methods.getTokenDetails(petId).call({from: ethereum.selectedAddress});
    console.log(data);
    renderPetProp(petId, data);
    $('#game').show();

}

function renderPetProp(petId, data){
    $("#pet_id").html(petId);
    $("#pet_damage").html(data.damage);
    $("#pet_magic").html(data.magic);
    $("#pet_endurance").html(data.endurance);

    let deathTime = new Date((parseInt(data.lastMeal) + parseInt(data.endurance)) * 1000);
    $("#pet_starvation").html(deathTime);


}

function getAbi(){
    return new Promise ( (res) => {
        $.getJSON("../build/contracts/Token.json", ( (json) => {
            res(json.abi);
        } ))
    })
    
}
document.getElementById("login_button").onclick = login;
// Load te game
renderGame();
