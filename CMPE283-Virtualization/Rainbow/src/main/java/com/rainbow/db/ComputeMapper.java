package com.rainbow.db;
import java.sql.ResultSet;
import java.sql.SQLException;
import org.springframework.jdbc.core.RowMapper;

import com.rainbow.beans.Compute;

public class ComputeMapper implements RowMapper {
   public Compute mapRow(ResultSet rs, int rowNum) throws SQLException {
      Compute instanceMapper = new Compute();
      instanceMapper.setName(rs.getString("name"));
      return instanceMapper;
   }
}