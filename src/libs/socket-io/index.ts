/* eslint-disable @typescript-eslint/no-explicit-any */
import { Socket } from "socket.io-client";

interface EventsMap {
  [event: string]: any;
}

export type CustomSocketEventMap<T> = { [K in keyof T]: (data: T[K]) => void };
export type UnsubscribeCallback = () => void;

/**
 * @returns true면 이벤트 리스너를 제거함
 */
export function onOnce<
  TListenEvents extends EventsMap,
  TListenEventName extends keyof TListenEvents,
>(
  socket: Socket<CustomSocketEventMap<TListenEvents>>,
  eventName: TListenEventName,
  callback: (data: TListenEvents[TListenEventName]) => boolean,
): UnsubscribeCallback;
export function onOnce(
  socket: Socket,
  eventName: string,
  callback: (data: any) => boolean,
): UnsubscribeCallback {
  const wrappedCallback = (data: any) => {
    const removed = callback(data);
    if (removed) socket.off(eventName, wrappedCallback);
  };

  socket.on(eventName, wrappedCallback);

  return () => {
    socket.off(eventName, wrappedCallback);
  };
}

export function onOncePromise<
  TListenEvents extends EventsMap,
  TListenEventName extends keyof TListenEvents,
  TLData extends
    TListenEvents[TListenEventName] = TListenEvents[TListenEventName],
>(
  socket: Socket<CustomSocketEventMap<TListenEvents>>,
  eventName: TListenEventName,
  filter?: (data: TListenEvents[TListenEventName]) => data is TLData,
): { promise: Promise<TLData>; unsubscribe: UnsubscribeCallback };
export function onOncePromise(
  socket: Socket,
  eventName: string,
  filter?: (data: unknown) => boolean,
): { promise: Promise<unknown>; unsubscribe: UnsubscribeCallback } {
  let wrappedCallback: any;

  const unsubscribe = () => {
    socket.off(eventName, wrappedCallback);
  };

  const promise = new Promise((resolve) => {
    wrappedCallback = async (data: any) => {
      const triggered = filter ? await filter(data) : true;
      if (!triggered) return;

      resolve(data);
      unsubscribe();
    };

    socket.on(eventName, wrappedCallback);
  });
  promise.finally(() => unsubscribe());

  return { promise, unsubscribe };
}
