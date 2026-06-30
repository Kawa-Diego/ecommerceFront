import { test, expect } from '@playwright/test';

test('home page renders main navigation', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Cardápio Digital/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Entrar/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Criar conta/i })).toBeVisible();
});

test('login page shows its form fields', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByRole('heading', { name: /Entrar/i })).toBeVisible();
  await expect(page.getByLabel(/E-mail/i)).toBeVisible();
  await expect(page.getByLabel(/Senha/i)).toBeVisible();
});

test('register page shows its form fields', async ({ page }) => {
  await page.goto('/register');
  await expect(page.getByRole('heading', { name: /Cadastre-se/i })).toBeVisible();
  await expect(page.getByLabel(/Nome/i)).toBeVisible();
  await expect(page.getByLabel(/E-mail/i)).toBeVisible();
  await expect(page.getByLabel(/CPF/i)).toBeVisible();
});

test('Expect to the register page works the Register button', async ({page}) => {
  await page.goto('/register')
  const getCreateAccount = page.getByRole('button', { name: 'Cadastrar'});
  await getCreateAccount.click();
});

test('Expect the login page the button Log in works', async ({page}) => {
  await page.goto('/login');
  const getLoginBtn = page.getByRole('button', { name: 'Entrar'});
  await getLoginBtn.click();
})
