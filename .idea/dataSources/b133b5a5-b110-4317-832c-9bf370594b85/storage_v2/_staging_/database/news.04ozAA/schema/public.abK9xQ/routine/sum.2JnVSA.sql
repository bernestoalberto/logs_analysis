CREATE OR REPLACE FUNCTION porcentage()  RETURNS TABLE (value TIMESTAMP,views float) AS $$
DECLARE
  part float;
  total float;
  percentage float;
BEGIN
  Select  Count(*) into part from log where log.status like '%404%' ;
  Select count(*) into total from log;
  percentage:= (part * 100) / total;
  if (percentage > (total * 0.01)) then
    RETURN  query  select day, percentage from log group by time;

  END IF ;
end;
$$ LANGUAGE 'plpgsql';
