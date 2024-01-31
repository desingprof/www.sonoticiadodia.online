const CEPinput = document.getElementById('cepinput')
const cepError = document.getElementById("cepError");
const freteForm = document.getElementById("freteForm");
const localidade = document.getElementById("localidade");
const uf = document.getElementById("uf");
const cep = document.getElementById("cep");
const bairro = document.getElementById("bairro");
const rua = document.getElementById("rua");
const info = document.getElementById("info");
const saldoElem = document.getElementById("saldo");

function spinWheel(roll) {

    const saldoAtual = getCookie('saldo')

    if(saldoAtual < 6) {
        return alert('Saldo insuficiente.')
    }

    const saldoNovo = saldoAtual - 6
    setCookie('saldo',saldoNovo, 3)
    saldoElem.innerHTML = saldoNovo

    var $wheel = $('.roulette-wrapper .wheel'),
        order = [0, 11, 5, 10, 6, 9, 7, 8, 1, 14, 2, 13, 3, 12, 4],
        position = order.indexOf(roll);

    //determine position where to land
    var rows = 12,
        card = 75 + 3 * 2,
        landingPosition = (rows * 15 * card) + (position * card);

    var randomize = Math.floor(Math.random() * 75) - (75 / 2);

    landingPosition = landingPosition + randomize;

    var object = {
        x: Math.floor(Math.random() * 50) / 100,
        y: Math.floor(Math.random() * 20) / 100
    };

    $wheel.css({
        'transition-timing-function': 'cubic-bezier(0,' + object.x + ',' + object.y + ',1)',
        'transition-duration': '6s',
        'transform': 'translate3d(-' + landingPosition + 'px, 0px, 0px)'
    });

    setTimeout(function () {
        $wheel.css({
            'transition-timing-function': '',
            'transition-duration': '',
        });

        var resetTo = -(position * card + randomize);
        $wheel.css('transform', 'translate3d(' + resetTo + 'px, 0px, 0px)');
    }, 6 * 1000);
}

const handleZipCode = (event) => {
    let input = event.target
    cepError.classList.add('hidden')
    input.value = zipCodeMask(input.value)
}

const zipCodeMask = (value) => {
    if (!value) return ""
    value = value.replace(/\D/g, '')
    value = value.replace(/(\d{5})(\d)/, '$1-$2')
    return value
}

const calcularFrete = async (event) => {
    event.preventDefault()
    if (CEPinput.value.length < 9) {
        cepError.innerHTML = "Digite um CEP válido."
        return cepError.classList.toggle('hidden')
    }

    fetch(`https://viacep.com.br/ws/${CEPinput.value.replace("-", "")}/json/`)
        .then(async T => {
            const data = await T.json()
            if (data.erro) {
                cepError.innerHTML = "Digite um CEP válido."
                return cepError.classList.toggle('hidden')
            }
            freteForm.classList.toggle('hidden')
            info.classList.toggle('hidden')
            localidade.innerHTML = data.localidade
            uf.innerHTML = data.uf
            cep.innerHTML = data.cep
            bairro.innerHTML = data.bairro
            rua.innerHTML = data.logradouro


        })

}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

const saldo = getCookie("saldo")

if(!saldo) {
    setCookie('saldo', 40, 3)
}

saldoElem.innerHTML = saldo
