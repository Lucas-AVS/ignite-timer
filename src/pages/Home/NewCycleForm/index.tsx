import { FormContainer, MinutesInput, TaskInput } from "./style";
import { useFormContext } from "react-hook-form";
import { useContext } from "react";
import { CyclesContext } from "../../../contexts/CyclesContext";

export default function NewCycleForm() {
  const { currentCycle } = useContext(CyclesContext);
  const { register } = useFormContext();

  return (
    <FormContainer>
      <label htmlFor="task">Vou trabalhar em</label>
      <TaskInput
        id="task"
        placeholder="Dê um nome para o seu projeto"
        list="task-suggestions"
        {...register("task")}
        disabled={!!currentCycle}
      ></TaskInput>

      <datalist id="task-suggestions">
        <option value="Projeto 1" />
        <option value="Projeto 2" />
        <option value="Projeto 3" />
      </datalist>

      <label htmlFor="minutesAmount">durante</label>
      <MinutesInput
        type="number"
        id="minutesAmount"
        placeholder="00"
        step={"5"}
        disabled={!!currentCycle}
        min={"1"}
        max={"90"}
        {...register("minutesAmount", { valueAsNumber: true })}
      ></MinutesInput>

      <span>minutos.</span>
    </FormContainer>
  );
}
