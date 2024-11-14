// 1. Funció verificarCredencials
function verificarCredencials(nomUsuari, contrasenya) {
    return new Promise((resolve, reject) => {
        const usuarisAutoritzats = [
            { nom: 'usuari1', contrasenya: '1234' },
            { nom: 'usuari2', contrasenya: 'abcd' },
            { nom: 'usuari3', contrasenya: 'qwerty' }
        ];

        setTimeout(() => {
            const usuariTrobat = usuarisAutoritzats.find(
                usuari => usuari.nom === nomUsuari && usuari.contrasenya === contrasenya
            );

            if (usuariTrobat) {
                resolve(`Benvingut/da, ${nomUsuari}!`);
            } else {
                reject('Credencials incorrectes. Si us plau, intenta-ho de nou.');
            }
        }, 2000);
    });
}

// 2. Funció accedirZonaRestringida
async function accedirZonaRestringida(nomUsuari, contrasenya) {
    try {
        const missatge = await verificarCredencials(nomUsuari, contrasenya);
        console.log(missatge);
    } catch (error) {
        console.error(error);
    }
}

// 3. Funció main per cridar a accedirZonaRestringida
function main() {
    const nomUsuari = 'usuari1'; // Canvia aquests valors per comprovar altres casos
    const contrasenya = '1234';
    accedirZonaRestringida(nomUsuari, contrasenya);
}

main();