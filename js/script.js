
function validateInviteCode() {
    var key = document.getElementById('invitecode').value;

    if (key == 'TBH{AES1-78SC-7845-WES8D-45FG}') {

        //window.open('http://localhost:8080/registration');
        document.location.href='/findme';
    } else {
        document.getElementById('invitecode').style.border = "3px solid red";
        // document.getElementById('Invite_message').innerHTML = "wrong key";
        document.getElementById('Invite_message').innerHTML = "Wrong key ,Try again !";
        document.getElementById('Invite_message').style.height = "30px";
        document.getElementById('Invite_message').style.padding = "10px 0px 0px 0px";
        document.getElementById('quote-invite').style.color = "red";


    }
}
