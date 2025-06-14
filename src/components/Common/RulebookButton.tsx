import { useState } from "react";

export const RulebookButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>
        <img
          className="h-16 w-16 hover:cursor-pointer"
          src="/buttons/rulebook.png"
          alt="rule book"
        />
      </button>
      {open && (
        <div className="modal-open modal" onClick={() => setOpen(false)}>
          <div
            className="relative modal-box max-w-3xl bg-neutral-900"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="btn absolute top-2 right-2 btn-circle btn-sm"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
            <h2 className="mb-4 text-center text-lg font-semibold">룰북</h2>
            <div className="max-h-[80vh] overflow-y-auto p-2">
              <div className="space-y-4 text-sm">
                <section className="rounded-lg bg-base-100 p-4 shadow-inner">
                  <h3 className="mb-2 border-b pb-1 text-center text-base font-bold">
                    🎯 게임 개요
                  </h3>
                  <p className="leading-relaxed">
                    금광부와 방해꾼의 정체를 숨긴 채 서로를 방해하며 금을 찾는
                    심리 전략 게임입니다.
                    <br />
                    플레이어는 무작위로 역할이 정해지며,
                    <span className="font-semibold text-blue-600">
                      {" "}
                      금광부는 금을 찾고
                    </span>
                    ,{" "}
                    <span className="font-semibold text-red-500">
                      방해꾼은 이를 막는 것
                    </span>
                    이 목적입니다.
                  </p>
                </section>

                <section className="rounded-lg bg-base-100 p-4 shadow-inner">
                  <h3 className="mb-2 border-b pb-1 text-center text-base font-bold">
                    🕹️ 게임 진행
                  </h3>
                  <p className="leading-relaxed">
                    총 3라운드로 진행되며, 각 라운드에서 플레이어는 차례로 턴을
                    수행합니다.
                    <br />첫 번째 라운드는 <b>무작위</b>로 시작하며, 이후
                    라운드는 <b>이전 결과</b>
                    에 따라 시작 플레이어가 바뀝니다.
                    <br />
                    라운드 종료 시 승리한 역할은 금 카드를 선택할 수 있으며,{" "}
                    <span className="font-bold text-warning">
                      카드마다 금의 개수가 다릅니다
                    </span>
                    .
                    <br />
                    3라운드가 끝나면 <b>가장 많은 금</b>을 획득한 플레이어가
                    최종 승리합니다.
                  </p>
                </section>

                <section className="rounded-lg bg-base-100 p-4 shadow-inner">
                  <h3 className="mb-2 border-b pb-1 text-center text-base font-bold">
                    🛠️ 게임 방법
                  </h3>
                  <p className="mb-2">
                    자신의 차례에 손패가 있다면 아래 중
                    <b className="text-blue-600"> 하나를 반드시 수행</b>
                    해야 합니다.
                  </p>
                  <ul className="ml-2 list-inside list-disc space-y-1">
                    <li>굴 카드 1장을 동굴 미로에 배치</li>
                    <li>행동카드 1장을 사용</li>
                    <li>아무 카드 1장을 버림</li>
                  </ul>
                  <p className="mt-2 text-gray-500 italic">
                    ※ 손패가 없다면 차례를 통과합니다.
                  </p>
                </section>

                <section className="rounded-lg bg-base-100 p-4 shadow-inner">
                  <h3 className="mb-4 border-b pb-1 text-center text-base font-bold">
                    🃏 카드 설명
                  </h3>

                  <div className="mb-4">
                    <h4 className="mb-1 font-semibold">📌 굴 카드</h4> <br></br>
                    <p className="text-sm leading-relaxed">
                      출발지에서 목적지까지 길을 잇습니다. 항상 기존 길과
                      이어져야 하며, 손패에서 180도 회전이 가능합니다.
                      출발지에서 연결된 경로만 유효합니다.
                    </p>
                  </div>

                  <div className="border-t border-gray-300 pt-4">
                    <h4 className="mb-1 font-semibold">📦 행동 카드</h4>{" "}
                    <br></br>
                    <ul className="list-inside list-disc space-y-3 text-sm leading-relaxed">
                      <li>
                        <b>망가진 장비</b>
                        <br />
                        다른 플레이어에게 사용하면 해당 플레이어는 굴 카드를
                        사용할 수 없습니다. 같은 종류의 망가진 장비 카드는
                        중복으로 받을 수 없습니다.
                      </li>
                      <li>
                        <b>장비 수리</b>
                        <br />
                        망가진 장비를 수리할 수 있으며, 자기 자신 또는 다른
                        플레이어에게 사용 가능합니다. 반드시 같은 종류만 수리할
                        수 있습니다.
                      </li>
                      <li>
                        <b>낙석</b>
                        <br />
                        출발지와 목적지를 제외한 굴 카드 1장을 제거합니다.
                      </li>
                      <li>
                        <b>지도</b>
                        <br />
                        목적지 카드 3장 중 하나를 선택하여 본인만 확인할 수
                        있습니다.
                      </li>
                    </ul>
                  </div>
                </section>

                <section className="rounded-lg bg-base-100 p-4 shadow-inner">
                  <h3 className="mb-2 border-b pb-1 text-center text-base font-bold">
                    📍 목적지 카드
                  </h3>
                  <p>
                    출발지부터 목적지까지 길이 이어졌을 경우, 해당 목적지 카드를
                    공개합니다. 이 중{" "}
                    <span className="font-medium text-warning">1장에만 금</span>
                    이 들어있습니다.
                  </p>
                </section>

                <section className="rounded-lg bg-warning p-4 text-black">
                  <h3 className="mb-2 border-b pb-1 text-center text-base font-bold">
                    🏆 승리 조건
                  </h3>
                  <ul className="ml-2 list-inside list-disc space-y-1">
                    <li>
                      <b>금광부:</b> 출발지에서 금 목적지까지 길을 이으면
                      승리합니다.
                    </li>
                    <li>
                      <b>방해꾼:</b> 모든 플레이어가 카드를 전부 사용할 때까지
                      출발지에서 금 목적지까지 도달하지 못하면 승리합니다.
                    </li>
                  </ul>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
