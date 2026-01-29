import { expect, test, type Page } from "@playwright/test";

type Credentials = {
  email: string;
  password: string;
};

type EnvKeys =
  | "E2E_USER_EMAIL"
  | "E2E_USER_PASSWORD"
  | "E2E_INACTIVE_EMAIL"
  | "E2E_INACTIVE_PASSWORD"
  | "E2E_ADMIN_EMAIL"
  | "E2E_ADMIN_PASSWORD";

const baseURL =
  process.env.PLAYWRIGHT_BASE_URL ??
  process.env.NEXT_PUBLIC_APP_URL ??
  "http://localhost:3000";

const getEnv = (key: EnvKeys) => process.env[key];

const hasRequiredEnv = (keys: EnvKeys[]) => keys.every((key) => getEnv(key));

const requireEnv = (keys: EnvKeys[]) => {
  if (!hasRequiredEnv(keys)) {
    test.skip(true, `Missing required env vars: ${keys.join(", ")}`);
  }
};

const signIn = async ({ page, credentials }: { page: Page; credentials: Credentials }) => {
  await page.goto("/sign-in");

  const emailInput = page.locator('input[name="identifier"], input[type="email"]');
  await expect(emailInput.first()).toBeVisible();
  await emailInput.first().fill(credentials.email);

  const continueButton = page.getByRole("button", { name: /continue|sign in/i });
  if (await continueButton.isVisible()) {
    await continueButton.click();
  }

  const passwordInput = page.locator('input[name="password"], input[type="password"]');
  await expect(passwordInput.first()).toBeVisible();
  await passwordInput.first().fill(credentials.password);

  const submitButton = page.getByRole("button", { name: /continue|sign in/i });
  await submitButton.click();
};

test.use({ baseURL });

test.describe("Auth e2e", () => {
  test("login success", async ({ page }) => {
    requireEnv(["E2E_USER_EMAIL", "E2E_USER_PASSWORD"]);

    await signIn({
      page,
      credentials: {
        email: getEnv("E2E_USER_EMAIL") ?? "",
        password: getEnv("E2E_USER_PASSWORD") ?? "",
      },
    });

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText(/dashboard/i)).toBeVisible();
  });

  test("login failure", async ({ page }) => {
    const failureEmail = process.env.E2E_INVALID_EMAIL ?? getEnv("E2E_USER_EMAIL");
    const failurePassword = process.env.E2E_INVALID_PASSWORD;

    if (!failureEmail || !failurePassword) {
      test.skip(true, "Missing E2E_INVALID_EMAIL or E2E_INVALID_PASSWORD for failure case.");
    }

    await signIn({
      page,
      credentials: {
        email: failureEmail ?? "",
        password: failurePassword ?? "",
      },
    });

    await expect(page).toHaveURL(/sign-in/);
    await expect(
      page.getByText(/incorrect|invalid|not found|couldn\u2019t|unable/i)
    ).toBeVisible();
  });

  test("inactive user blocked", async ({ page }) => {
    requireEnv(["E2E_INACTIVE_EMAIL", "E2E_INACTIVE_PASSWORD"]);

    await signIn({
      page,
      credentials: {
        email: getEnv("E2E_INACTIVE_EMAIL") ?? "",
        password: getEnv("E2E_INACTIVE_PASSWORD") ?? "",
      },
    });

    await expect(page).toHaveURL(/\/inactive/);
    await expect(page.getByText(/account inactive/i)).toBeVisible();
  });

  test("admin user creation flow", async ({ page }) => {
    requireEnv(["E2E_ADMIN_EMAIL", "E2E_ADMIN_PASSWORD"]);

    await signIn({
      page,
      credentials: {
        email: getEnv("E2E_ADMIN_EMAIL") ?? "",
        password: getEnv("E2E_ADMIN_PASSWORD") ?? "",
      },
    });

    await page.goto("/dashboard/users");

    const timestamp = Date.now();
    const inviteDomain = process.env.E2E_INVITE_EMAIL_DOMAIN ?? "example.com";
    const inviteEmail = `e2e+${timestamp}@${inviteDomain}`;

    await page.getByLabel("Full name").fill(`E2E Invite ${timestamp}`);
    await page.getByLabel("Email").fill(inviteEmail);
    await page.getByRole("button", { name: /send invite/i }).click();

    await expect(page.getByText(/invitation sent\./i)).toBeVisible();
  });
});
