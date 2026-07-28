import { test, expect } from '@playwright/test';

//mapeando a URL da página de login do sistema
const URL_LOGIN = 'https://sergiocotiazure20265-ops.github.io/produtos-cypress-site/index.html';
const URL_PRODUTOS = 'https://sergiocotiazure20265-ops.github.io/produtos-cypress-site/produtos.html';

//Criar o caso de teste
test.describe('Caso de teste - Login de usuários', () => {

    //Função executada antes de cada cenário de teste
    test.beforeEach(async ({ page }) => {
        //Abrir a página de login do sistema
        await page.goto(URL_LOGIN);
    });

    //Cenário de teste
    test('Deve realizar login com sucesso para usuário válido.', async({ page }) => {
        
        //Preencher os campos de login e senha corretos
        await page.locator('#emailLogin').fill('admin@bluestock.com');
        await page.locator('#senhaLogin').fill('Admin@123');

        //Clicar no botão de login
        await page.locator('#btnEntrar').click();

        //Verificar se o usuário foi autenticado
        await expect(page).toHaveURL(URL_PRODUTOS);

        //Gerar evidência
        await page.screenshot({
            path: 'evidencias/login-valido.png',
            fullPage: true
        });
    });

    //Cenário de teste
    test('Não deve autenticar usuário com credenciais inválidas.', async({ page }) => {

        //Preencher os campos de login e senha inválidos
        await page.locator('#emailLogin').fill('teste@email.com');
        await page.locator('#senhaLogin').fill('Teste@2026');

        //Clicar no botão de login
        await page.locator('#btnEntrar').click();

        //Verificar se o sistema exibe mensagem de erro
        await expect(
            page.getByText('E-mail ou senha inválidos.')
        ).toBeVisible();

        //Gerar evidência
        await page.screenshot({
            path: 'evidencias/acesso-negado.png',
            fullPage: true
        });
    });

});
