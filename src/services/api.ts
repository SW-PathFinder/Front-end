// import axios from "axios";

// const API_BASE_URL = "https://api.example.com"; // 추후 실제 API URL로 변경

/**
 * 닉네임 중복 확인 API 호출
 * @param nickname 확인할 닉네임
 * @returns HTTP 응답 전체
 */
export const checkNicknameAvailability = (
  nickname: string,
): Promise<{ nickname: string; isAvailable: boolean; message: string }> => {
  return new Promise((resolve) => {
    resolve({ nickname, isAvailable: true, message: "닉네임 사용 가능" });
  });
  // return axios.get<{ isAvailable: boolean; message: string }>(
  //   `${API_BASE_URL}/api/check-nickname`,
  //   { params: { nickname } },
  // );
};
