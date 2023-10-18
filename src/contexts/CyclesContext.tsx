import { differenceInSeconds } from "date-fns";
import {
  ReactNode,
  createContext,
  useEffect,
  useReducer,
  useState,
} from "react";

interface ICreateCycleData {
  task: string;
  minutesAmount: number;
}

interface ICycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishDate?: Date;
}

interface ICyclesContext {
  cycles: ICycle[];
  currentCycle: ICycle | undefined;
  activeCycleId: string | null;
  amountSecondsPassed: number;
  markCurrentCycleAsFinished: () => void;
  setSecondsPassed: (seconds: number) => void;
  createNewCycle: (data: ICreateCycleData) => void;
  interruptCurrentCycle: () => void;
}

interface ICyclesState {
  cycles: ICycle[];
  activeCycleId: string | null;
}

interface CyclesContextProviderProps {
  children: ReactNode;
}

interface IAddNewCycleAction {
  type: "ADD_NEW_CYCLE";
  payload: {
    newCycle: ICycle;
  };
}
interface IMarkCurrentCycleAsFinishedAction {
  type: "MARK_CURRENT_CYCLE_AS_FINISHED";
  payload: {
    activeCycleId: string | null;
  };
}
interface IInterruptCurrentCycleAction {
  type: "INTERRUPT_CURRENT_CYCLE";
  payload: {
    activeCycleId: string | null;
  };
}
type CyclesAction =
  | IAddNewCycleAction
  | IMarkCurrentCycleAsFinishedAction
  | IInterruptCurrentCycleAction;

export const CyclesContext = createContext({} as ICyclesContext);

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(
    (state: ICyclesState, action: CyclesAction): ICyclesState => {
      switch (action.type) {
        case "ADD_NEW_CYCLE":
          return {
            ...state,
            cycles: [...state.cycles, action.payload.newCycle],
            activeCycleId: action.payload.newCycle.id,
          };
        case "MARK_CURRENT_CYCLE_AS_FINISHED":
          return {
            ...state,
            cycles: state.cycles.map((cycle) => {
              if (cycle.id === state.activeCycleId) {
                return { ...cycle, finishDate: new Date() };
              } else {
                return cycle;
              }
            }),
            activeCycleId: null,
          };
        case "INTERRUPT_CURRENT_CYCLE":
          return {
            ...state,
            cycles: state.cycles.map((cycle) => {
              if (cycle.id === state.activeCycleId) {
                return { ...cycle, interruptedDate: new Date() };
              } else {
                return cycle;
              }
            }),
            activeCycleId: null,
          };
        default:
          return state;
      }
    },
    {
      cycles: [],
      activeCycleId: null,
    },
    (initialState) => {
      const storedStateAsJSON = localStorage.getItem(
        "@ignite-timer:cycles-state-1.0.0"
      );
      if (storedStateAsJSON) {
        return JSON.parse(storedStateAsJSON);
      }

      return initialState;
    }
  );

  const { cycles, activeCycleId } = cyclesState;
  const currentCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if (currentCycle) {
      return differenceInSeconds(new Date(), new Date(currentCycle.startDate));
    }
    return 0;
  });

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds);
  }

  const createNewCycle = (data: ICreateCycleData) => {
    const id = String(new Date().getTime());

    const newCycle: ICycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };

    dispatch({
      type: "ADD_NEW_CYCLE",
      payload: {
        newCycle,
      },
    });
    setAmountSecondsPassed(0);
  };

  function markCurrentCycleAsFinished() {
    dispatch({
      type: "MARK_CURRENT_CYCLE_AS_FINISHED",
      payload: {
        activeCycleId,
      },
    });
  }

  function interruptCurrentCycle() {
    dispatch({
      type: "INTERRUPT_CURRENT_CYCLE",
      payload: {
        activeCycleId,
      },
    });
  }

  useEffect(() => {
    localStorage.setItem(
      "@ignite-timer:cycles-state-1.0.0",
      JSON.stringify(cyclesState)
    );
  }, [cyclesState]);

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        currentCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        amountSecondsPassed,
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  );
}
