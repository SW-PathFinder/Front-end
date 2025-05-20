import { useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { checkNicknameAvailability } from "../services/api";

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
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: yupResolver(schema) });

  const onSubmit = async (data: LoginFormValues): Promise<void> => {
    setServerError(null);
    try {
      const { data: result } = await checkNicknameAvailability(data.nickname);
      if (result.isAvailable) {
        // 현재는 alert로 처리, 추후 LobbyPage로 이동하는 로직 추가 예정
        alert("닉네임 사용 가능");
      } else {
        setServerError(result.message || "이미 사용 중인 닉네임입니다.");
      }
    } catch (error) {
      setServerError("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-6 flex items-center justify-center">
          <img src="/logo.png" alt="Logo" />
        </div>
        <h1 className="mb-6 text-center text-2xl font-bold">닉네임 입력</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="닉네임을 입력하세요"
              {...register("nickname", {
                onChange: () => setServerError(null),
              })}
              className={`w-full rounded border px-3 py-2 ${errors.nickname || serverError ? "border-red-500" : "border-gray-300"}`}
              disabled={isSubmitting}
            />
            {(errors.nickname?.message || serverError) && (
              <p className="mt-1 text-sm text-red-600">
                {errors.nickname?.message || serverError}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full rounded bg-blue-500 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
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
