import { useContext } from "react";
import { HistoryContainer, HistoryList, Status } from "./style";
import { formatDistanceToNow } from "date-fns";
import { CyclesContext } from "../../contexts/CyclesContext";

export default function History() {
  const { cycles } = useContext(CyclesContext);

  //latest cycles on top
  const reversedCyclesOrder = cycles.slice().reverse();

  return (
    <HistoryContainer>
      <h1>Meu histórico</h1>
      <HistoryList>
        <table>
          <thead>
            <tr>
              <th>Tarefa</th>
              <th>Duração</th>
              <th>Início</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {reversedCyclesOrder
              ? reversedCyclesOrder.map((cycle) => {
                  return (
                    <tr key={cycle.id}>
                      <td>{cycle.task}</td>
                      <td>{cycle.minutesAmount} minutes</td>
                      <td>
                        {formatDistanceToNow(new Date(cycle.startDate), {
                          addSuffix: true,
                        })}
                      </td>
                      <td>
                        {cycle.finishDate && (
                          <Status statusColor="green">Concluido</Status>
                        )}
                        {cycle.interruptedDate && (
                          <Status statusColor="red">Interrompido</Status>
                        )}
                        {!cycle.interruptedDate && !cycle.finishDate && (
                          <Status statusColor="yellow">Em andamento</Status>
                        )}
                      </td>
                    </tr>
                  );
                })
              : null}
          </tbody>
        </table>
      </HistoryList>
    </HistoryContainer>
  );
}
