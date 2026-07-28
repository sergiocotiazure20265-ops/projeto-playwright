import { test, expect } from '@playwright/test';

//Mapeando a URL da página de cadastro
const URL_CADASTRO =
    'https://sergiocotiazure20265-ops.github.io/produtos-cypress-site/cadastro.html';

/**
 * Gera um endereço de e-mail diferente para cada execução.
 *
 * Utilizamos:
 * - Data e hora atual;
 * - Número aleatório.
 */
function gerarEmailUnico() {

    const timestamp = Date.now();
    const numeroAleatorio = Math.floor(Math.random() * 100000);

    return `usuario.${timestamp}.${numeroAleatorio}@email.com`;
}

//Criar o caso de teste
test.describe('Caso de teste - Cadastro de usuários', () => {

    //Função executada antes de cada cenário de teste
    test.beforeEach(async ({ page }) => {

        //Abrir a página de cadastro de usuários
        await page.goto(URL_CADASTRO);
    });

    //Cenário de teste
    test('Deve cadastrar um usuário com sucesso.', async ({ page }) => {

        //Gerar um e-mail diferente para esta execução
        const emailUsuario = gerarEmailUnico();

        //Preencher os campos do formulário
        await page.locator('#nomeUsuario').fill('Usuário Playwright');
        await page.locator('#emailUsuario').fill(emailUsuario);
        await page.locator('#senhaUsuario').fill('Teste@2026');

        //Clicar no botão de cadastro
        await page.locator('#btnCadastrarUsuario').click();

        //Localizar a mensagem exibida pelo sistema
        const mensagemSucesso = page.locator('#alertaCadastroUsuario');

        //Verificar se a mensagem de sucesso está visível
        await expect(mensagemSucesso).toBeVisible();

        //Verificar o conteúdo da mensagem
        await expect(mensagemSucesso).toHaveText(
            'Usuário cadastrado com sucesso. Você já pode fazer login.'
        );

        //Gerar evidência
        await page.screenshot({
            path: 'evidencias/cadastro-usuario-sucesso.png',
            fullPage: true
        });
    });

    //Cenário de teste
    test('Não deve permitir cadastrar um usuário com e-mail já existente.', async ({ page }) => {

        //Gerar um novo e-mail para este cenário
        const emailUsuario = gerarEmailUnico();

        /*
         * Primeiro cadastro:
         * cadastramos o usuário para garantir que o e-mail exista.
         */
        await page.locator('#nomeUsuario').fill('Primeiro Usuário');
        await page.locator('#emailUsuario').fill(emailUsuario);
        await page.locator('#senhaUsuario').fill('Teste@2026');

        await page.locator('#btnCadastrarUsuario').click();

        //Verificar se o primeiro cadastro foi realizado
        await expect(
            page.locator('#alertaCadastroUsuario')
        ).toHaveText(
            'Usuário cadastrado com sucesso. Você já pode fazer login.'
        );

        /*
         * Segunda tentativa:
         * tentamos cadastrar outro usuário utilizando o mesmo e-mail.
         */
        await page.locator('#nomeUsuario').fill('Segundo Usuário');
        await page.locator('#emailUsuario').fill(emailUsuario);
        await page.locator('#senhaUsuario').fill('OutraSenha@2026');

        await page.locator('#btnCadastrarUsuario').click();

        //Localizar a mensagem de erro
        const mensagemErro = page.locator('#alertaCadastroUsuario');

        //Verificar se a mensagem está visível
        await expect(mensagemErro).toBeVisible();

        //Verificar o conteúdo da mensagem
        await expect(mensagemErro).toHaveText(
            'Já existe um usuário cadastrado com este e-mail.'
        );

        //Gerar evidência
        await page.screenshot({
            path: 'evidencias/cadastro-email-existente.png',
            fullPage: true
        });
    });

});