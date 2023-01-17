import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useTimer } from "use-timer";
import { timerTypeAtom, typingStateAtom } from "../state";
import { useStore } from "../state/words-slice";

export function useTypingTimer() {
	// const timer = useRecoilValue(timerTypeAtom);
	const { timer, typingState, dispatch } = useStore(
		(state) => ({
			timer: state.timerType,
			typingState: state.typingState,
			dispatch: state.dispatch,
		}),
	);
	// const [userTypingState, setTypingState] = useRecoilState(typingStateAtom);

	const { start, reset, time } = useTimer({
		autostart: false,
		initialTime: timer === "INCREMENTAL" ? 0 : 60,
		endTime: timer === "INCREMENTAL" ? undefined : 0,
		timerType: timer,
		onTimeOver: () => dispatch({ typingState: "DONE" }),
	});

	useEffect(() => {
		if (typingState === "STARTED") {
			start();
		} else if (typingState === "IDLE") {
			reset();
		}
	}, [reset, start, typingState]);

	return {
		time,
		state: typingState,
	};
}
