import { useForm, FormProvider } from "react-hook-form";
import { HandPalm, Play } from "phosphor-react";
import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from "./style";
import { useContext } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import NewCycleForm from "./NewCycleForm";
import Countdown from "./Countdown";
import { CyclesContext } from "../../contexts/CyclesContext";

const newCycleFormValidationSchema = z.object({
  task: z.string().min(5, "Informe a tarefa"),
  minutesAmount: z
    .number()
    .min(5, "O ciclo precisa ser de no minimo 5 minutos")
    .max(90, "O ciclo precisa ser de no maximo 90 minutos"),
});

type FormType = z.infer<typeof newCycleFormValidationSchema>;

export function Home() {
  const { currentCycle, createNewCycle, interruptCurrentCycle } =
    useContext(CyclesContext);

  const newCycleForm = useForm<FormType>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
  });

  const { handleSubmit, watch, reset } = newCycleForm;

  function handleCreateNewCycle(data: FormType) {
    createNewCycle(data);
    reset();
  }

  // if there is no taks the button will be disabled
  const task = watch("task");

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        <Countdown />

        {currentCycle ? (
          <StopCountdownButton onClick={interruptCurrentCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={!task} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  );
}
