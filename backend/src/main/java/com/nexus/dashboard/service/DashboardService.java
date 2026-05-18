package com.nexus.dashboard.service;

import com.nexus.customer.repository.CustomerRepository;
import com.nexus.product.repository.ProductRepository;
import com.nexus.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final CustomerRepository customerRepository;
    private final ProductRepository  productRepository;

    @Transactional(readOnly = true)
    public Map<String, Object> getSummary(User user) {
        return Map.of(
                "totalCustomers", customerRepository.count(),
                "activeCustomers", customerRepository.count(),
                "leadCustomers", customerRepository.count(),
                "totalProducts",   productRepository.count(),
                "activeProducts",  productRepository.count(),
                "monthlyRevenue",  48750.00,
                "revenueGrowth",   12.5,
                "conversionRate",  3.2,
                "avgTicket",       850.00
        );
    }

    public List<Map<String, Object>> getRevenueChart() {
        return List.of(
                Map.of("month","Jan","revenue",32000,"customers",45,"expenses",18000),
                Map.of("month","Fev","revenue",38500,"customers",52,"expenses",21000),
                Map.of("month","Mar","revenue",41200,"customers",48,"expenses",22500),
                Map.of("month","Abr","revenue",39800,"customers",61,"expenses",20000),
                Map.of("month","Mai","revenue",45600,"customers",55,"expenses",24000),
                Map.of("month","Jun","revenue",48750,"customers",70,"expenses",25500)
        );
    }

    public List<Map<String, Object>> getRecentActivity() {
        return List.of(
                Map.of("id",1,"type","customer","message","Novo cliente: Empresa Alpha Ltda","time","2 min atrás"),
                Map.of("id",2,"type","product","message","Produto atualizado: Licença Pro Mensal","time","15 min atrás"),
                Map.of("id",3,"type","customer","message","Cliente atualizado: Beta Soluções SA","time","1h atrás"),
                Map.of("id",4,"type","product","message","Novo produto: API Add-on","time","3h atrás"),
                Map.of("id",5,"type","customer","message","Novo cliente: Delta Comércio","time","5h atrás"),
                Map.of("id",6,"type","product","message","Estoque atualizado: Consultoria Setup","time","6h atrás")
        );
    }

    public List<Map<String, Object>> getTopProducts() {
        return List.of(
                Map.of("name","Licença Pro Mensal","sales",284,"revenue",new BigDecimal("85181.60"),"growth",18.2),
                Map.of("name","Licença Enterprise Anual","sales",47,"revenue",new BigDecimal("140953.00"),"growth",32.5),
                Map.of("name","Consultoria Setup","sales",31,"revenue",new BigDecimal("46500.00"),"growth",-5.1),
                Map.of("name","Suporte Premium","sales",58,"revenue",new BigDecimal("34742.00"),"growth",12.0),
                Map.of("name","Treinamento Online","sales",112,"revenue",new BigDecimal("55888.00"),"growth",8.7)
        );
    }
}
