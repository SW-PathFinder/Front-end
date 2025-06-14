import { useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Navigate } from "react-router";
import * as yup from "yup";

import { useAuth } from "../contexts/AuthContext";
import login_bg from "/bg/saboteur_bg.png";

interface LoginFormValues {
  nickname: string;
}

const schema = yup.object({
  nickname: yup
    .string()
    .required("닉네임을 입력해주세요.")
    .min(3, "닉네임은 3자 이상이어야 합니다.")
    .max(16, "닉네임은 16자 이하이어야 합니다.")
    .matches(/^[가-힣a-zA-Z0-9]+$/, "한글, 영문, 숫자만 사용 가능합니다."),
});

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: yupResolver(schema) });
  const [serverError, setServerError] = useState<string | null>(null);

  const navigate = useNavigate();

  const { login, userId } = useAuth();
  if (userId) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = handleSubmit(
    async (data: LoginFormValues): Promise<void> => {
      setServerError(null);
      try {
        await login(data.nickname);
        navigate("/");
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
        setServerError(message);
      }
    },
  );

  return (
    <div
      className="flex min-h-screen flex-col items-center bg-cover bg-center"
      style={{ backgroundImage: `url(${login_bg})` }}
    >
      <div className="absolute top-12">
        <img src="/logo.png" alt="Logo" className="w-4xl" />
      </div>
      <div className="absolute bottom-18 w-full max-w-sm">
        <form onSubmit={onSubmit} className="flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-2">
            {(errors.nickname?.message || serverError) && (
              <div role="alert" className="alert alert-warning">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 shrink-0 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                {errors.nickname?.message || serverError}
              </div>
            )}
            <input
              type="text"
              placeholder="닉네임을 입력하세요"
              {...register("nickname", {
                onChange: () => setServerError(null),
              })}
              className={`input input-xl w-full text-center ${errors.nickname || serverError ? "input-warning" : ""}`}
              disabled={isSubmitting}
            />
          </div>
          <button
            type="submit"
            className="btn w-full btn-soft btn-xl"
            disabled={isSubmitting}
          >
            {isSubmitting ? "확인 중..." : "확인"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
