import { test, expect } from '@playwright/test';

const loginResponse = {
  token: 'fake-jwt-token',
  name: 'Usuário Teste',
  email: 'usuario@teste.com',
};

const currentUserResponse = {
  name: 'Usuário Teste',
  email: 'usuario@teste.com',
  cpf: '11144477735',
};

test.describe('Auth flow', () => {
  test('login page shows its form fields', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByRole('heading', { name: /Entrar/i })).toBeVisible();
    await expect(page.getByLabel('E-mail')).toBeVisible();
    await expect(page.getByLabel('Senha')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Entrar' })).toBeVisible();
  });

  test('should login successfully and redirect to dashboard', async ({ page }) => {
    await page.route('**/api/auth/login', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(loginResponse),
      }),
    );

    await page.route('**/api/users/me', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(currentUserResponse),
      }),
    );

    await page.goto('/login');
    await page.getByLabel('E-mail').fill(loginResponse.email);
    await page.getByLabel('Senha').fill('SenhaForte1!');
    await page.getByRole('button', { name: 'Entrar' }).click();

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole('heading', { name: /Área logada/i })).toBeVisible();
    await expect(page.getByText(/Bem-vindo, Usuário Teste/i)).toBeVisible();
  });

  test('register page shows its form fields', async ({ page }) => {
    await page.goto('/register');

    await expect(page.getByRole('heading', { name: /Cadastre-se/i })).toBeVisible();
    await expect(page.getByLabel('Nome')).toBeVisible();
    await expect(page.getByLabel('E-mail')).toBeVisible();
    await expect(page.getByLabel('CPF')).toBeVisible();
    await expect(page.getByLabel('Senha')).toBeVisible();
    await expect(page.getByLabel('Confirmar senha')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cadastrar' })).toBeVisible();
  });

  test('should register successfully and navigate to login with success banner', async ({ page }) => {
    await page.route('**/api/auth/register', (route) =>
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Usuário criado com sucesso' }),
      }),
    );

    await page.goto('/register');

    await page.getByLabel('Nome').fill('Teste Usuario');
    await page.getByLabel('E-mail').fill('teste@teste.com');
    await page.getByLabel('CPF').fill('111.444.777-35');
    await page.getByLabel('Senha').fill('SenhaForte1!');
    await page.getByLabel('Confirmar senha').fill('SenhaForte1!');
    await page.getByRole('button', { name: 'Cadastrar' }).click();

    await expect(page).toHaveURL(/\/login/);
    await expect(
      page.getByText(/Cadastro realizado com sucesso\. Faça login\./i),
    ).toBeVisible();
  });
});