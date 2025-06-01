import { Meta, StoryObj } from "@storybook/react";
import { http, HttpResponse } from "msw";
import { BrowserRouter } from "react-router";

import { AuthProvider } from "@/components/Common/AuthProvider";

import LoginPage from "./LoginPage";

const meta: Meta<typeof LoginPage> = {
  title: "Pages/LoginPage",
  component: LoginPage,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <AuthProvider>
        <BrowserRouter>
          <Story />
        </BrowserRouter>
      </AuthProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof LoginPage>;

const TestData = ["admin", "testuser", "중복된닉네임", "newuser123", "guest"];

export const MockedReturn: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("https://api.example.com/api/check-nickname", (req) => {
          const nickname =
            new URL(req.request.url).searchParams.get("nickname") || "";
          if (TestData.includes(nickname)) {
            return HttpResponse.json(
              { isAvailable: false, message: "이미 사용 중인 닉네임입니다." },
              { status: 200 },
            );
          }
          return HttpResponse.json(
            { isAvailable: true, message: "사용 가능한 닉네임입니다." },
            { status: 200 },
          );
        }),
      ],
    },
  },
};
export const ServerError: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("https://api.example.com/api/check-nickname", () => {
          return HttpResponse.json(
            { message: "서버 오류가 발생했습니다." },
            { status: 500 },
          );
        }),
      ],
    },
  },
};
